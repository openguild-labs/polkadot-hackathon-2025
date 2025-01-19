import { Injectable } from '@nestjs/common';
import { floor } from 'src/common/helpers/utils';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { ConfigService } from '@nestjs/config';
import { Config, ContractConfig } from 'src/configs/config.interface';

@Injectable()
export class SuiService {
  tokenDecimalsMap = new Map<string, number>();
  private client: SuiClient;
  private coinType: string;
  private keyPair: Ed25519Keypair;

  constructor(
    private readonly configService: ConfigService<Config>,
  ) {
    const config = this.configService.get<ContractConfig>('contract');
    this.client = new SuiClient({
      url: config.rpc_url
    });
    this.coinType = config.coinType;
    this.keyPair = Ed25519Keypair.deriveKeypair(config.mnemonic, "m/44'/784'/0'/0'/0'");
  }

  public async getConnection() {
    return this.client;
  }

  public async transferSplToken(
    receiverAddress: string,
    amount: number,
  ) {
    // Transfer token
    const decimals = await this.getTokenDecimals(this.coinType);

    const toAmount = floor(amount, decimals) * Math.pow(10, decimals);
    const tx = new TransactionBlock();

    const coinXs = await this.client.getCoins({ owner: this.keyPair.toSuiAddress(), coinType: this.coinType });
    const [primaryCoinX, ...restCoinXs] = coinXs.data;
    if (restCoinXs.length > 0) {
      tx.mergeCoins(
        tx.object(primaryCoinX.coinObjectId),
        restCoinXs.map((coin) => tx.object(coin.coinObjectId)),
      );
    }
    const [coinIn] = tx.splitCoins(tx.object(primaryCoinX.coinObjectId), [tx.pure(toAmount)])
    tx.transferObjects([coinIn], tx.pure(receiverAddress, "address"));
    const result = await this.client.signAndExecuteTransactionBlock({
      signer: this.keyPair,
      transactionBlock: tx,
    });

    return result.digest;
  }

  // Get token decimals
  async getTokenDecimals(coinType: string) {
    const coinMetadata = await this.client.getCoinMetadata({
      coinType: coinType
    });    
    return coinMetadata.decimals;
  }

  async getSplTokenBalance(
    walletPubkey: string,
  ) {
    const balance = await this.client.getBalance({
      owner: walletPubkey,
      coinType: this.coinType,
    });

    if (balance.totalBalance == null) return 0;
    return Number(balance.totalBalance);
  }

}
