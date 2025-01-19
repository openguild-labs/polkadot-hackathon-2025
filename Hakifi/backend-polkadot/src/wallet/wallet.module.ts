import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { BullModule } from '@nestjs/bull';
import { WALLET_QUEUE_NAME } from './wallet.constant';
import { WalletQueue } from './wallet.queue';

@Module({
  imports: [
    BullModule.registerQueue({
      name: WALLET_QUEUE_NAME,
    }),
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletQueue],
})
export class WalletModule { }
