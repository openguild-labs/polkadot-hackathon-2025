import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { WALLET_QUEUE_ACTION, WALLET_QUEUE_NAME } from './wallet.constant';
import { WalletService } from './wallet.service';
import { Transaction } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Processor(WALLET_QUEUE_NAME)
export class WalletQueue {
  private readonly logger = new Logger(WalletQueue.name);
  constructor(
    private readonly walletService: WalletService,
    private readonly prismaService: PrismaService,
  ) {}

  @Process({
    name: WALLET_QUEUE_ACTION.WITHDRAW,
    concurrency: 2,
  })
  async withdrawQueue(payload: Job<Transaction>) {
    const txn = payload.data;
    this.logger.log(`Processing withdraw txn: ${txn.id}`);
    const commissionWalletBalance =
      await this.walletService.getBalanceCommissionWallet();

    this.logger.log(`Commission wallet balance: ${commissionWalletBalance}`);
    if (txn.amount > commissionWalletBalance) {
      this.logger.error(`Insufficient balance for withdraw txn: ${txn.id}`);
      return;
    }

    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: txn.userId },
      });

      if (!user) throw new Error('User not found');

      const txhash = await this.walletService.transferToUser(
        user.walletAddress,
        txn.amount,
      );
      await this.walletService.withdrawSuccess(txn, txhash);
    } catch (error) {
      await this.walletService.withdrawFailed(txn, error.message);
    }
  }
}
