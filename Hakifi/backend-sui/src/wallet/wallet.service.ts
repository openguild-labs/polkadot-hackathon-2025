import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { WalletsQueryDto } from './dto/query-wallet.dto';
import { ConfigService } from '@nestjs/config';
import { Config, ContractConfig } from 'src/configs/config.interface';
import {
  BaseUnit,
  Transaction,
  TransactionStatus,
  TransactionType,
  User,
} from '@prisma/client';
import { InjectQueue } from '@nestjs/bull';
import { WALLET_QUEUE_ACTION, WALLET_QUEUE_NAME } from './wallet.constant';
import { Queue } from 'bull';
import { floor } from 'src/common/helpers/utils';
import { SuiService } from 'src/sui/sui.service';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  private keyPair: Ed25519Keypair;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<Config>,
    @InjectQueue(WALLET_QUEUE_NAME) private readonly walletQueue: Queue,
    private readonly suiService: SuiService,
  ) {
    const config = this.configService.get<ContractConfig>('contract');
    this.keyPair = Ed25519Keypair.deriveKeypair(config.mnemonic, "m/44'/784'/0'/0'/0'");
  }

  async faucetUsdt(user: User) {
    const amount = 1000; // 1000 USDT

    if (user.isFaucet) {
      throw new BadRequestException('You have already received the faucet');
    }
    try {
      const txhash = await this.transferToUser(user.walletAddress, amount);
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          isFaucet: true,
        },
      });
      return {
        txhash,
      };
    } catch (error) {
      this.logger.error('Failed to transfer USDT', error);
      throw new InternalServerErrorException(
        'Failed to transfer USDT, please try again later',
      );
    }
  }

  async getWallets(query: WalletsQueryDto) {
    const { userId, asset } = query;
    if (asset) {
      const wallet = await this.prismaService.wallet.findUnique({
        where: {
          userId_asset: {
            userId,
            asset,
          },
        },
      });
      if (!!wallet) return wallet;

      return await this.prismaService.wallet.create({
        data: { asset, userId },
      });
    }

    return this.prismaService.wallet.findMany({
      where: {
        userId,
      },
    });
  }

  async withdraw(userId: string) {
    const asset = BaseUnit.USDT;
    const MinimumWithdrawAmount = 10; // 10 USDT
    const wallet = await this.prismaService.wallet.findUnique({
      where: {
        userId_asset: {
          userId,
          asset,
        },
      },
      include: {
        user: {
          select: {
            walletAddress: true,
          },
        },
      },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const available = floor(wallet.balance - wallet.locked, 9);

    if (available < MinimumWithdrawAmount) {
      throw new BadRequestException(
        `Your balance is too low to withdraw (minimum ${MinimumWithdrawAmount} USDT)`,
      );
    }

    const withdrawTxn = await this.prismaService.$transaction(async (tx) => {
      const w = await this.prismaService.wallet.update({
        where: {
          userId_asset: {
            userId,
            asset,
          },
        },
        data: {
          locked: {
            increment: available,
          },
        },
      });

      if (w.balance - wallet.locked < 0) {
        throw new BadRequestException('Insufficient balance');
      }
      //13.277068601966105

      return await this.prismaService.transaction.create({
        data: {
          userId,
          amount: available,
          unit: asset,
          status: TransactionStatus.PENDING,
          type: TransactionType.WITHDRAW,
        },
      });
    });
    await this.walletQueue.add(WALLET_QUEUE_ACTION.WITHDRAW, withdrawTxn);

    return withdrawTxn;
  }

  async withdrawSuccess(txn: Transaction, hash: string) {
    console.log('txn.amount', txn.amount);
    return await this.prismaService.$transaction([
      this.prismaService.wallet.update({
        where: {
          userId_asset: {
            userId: txn.userId,
            asset: txn.unit,
          },
        },
        data: {
          locked: {
            decrement: txn.amount,
          },
          balance: {
            decrement: txn.amount,
          },
        },
      }),
      this.prismaService.transaction.update({
        where: {
          id: txn.id,
        },
        data: {
          status: TransactionStatus.SUCCESS,
          txhash: hash,
        },
      }),
    ]);
  }

  async withdrawFailed(txn: Transaction, error: string) {
    return await this.prismaService.transaction.update({
      where: {
        id: txn.id,
      },
      data: {
        status: TransactionStatus.FAILED,
        error,
      },
    });
  }

  async transferToUser(walletAddress: string, amount: number) {
    const txhash = await this.suiService.transferSplToken(
      walletAddress,
      amount,
    );
    return txhash;
  }

  async getBalanceCommissionWallet() {
    const balance = await this.suiService.getSplTokenBalance(
      this.keyPair.toSuiAddress(),
    );
    return balance;
  }
}
