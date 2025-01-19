import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { BullModule } from '@nestjs/bull';
import { WALLET_QUEUE_NAME } from './wallet.constant';
import { WalletQueue } from './wallet.queue';
import { SuiModule } from 'src/sui/sui.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: WALLET_QUEUE_NAME,
    }),
    SuiModule
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletQueue],
})
export class WalletModule {}
