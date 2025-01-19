import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceController } from './binance.controller';
import { BinanceCommand } from './binance.commands';

@Module({
  controllers: [BinanceController],
  providers: [BinanceService, BinanceCommand],
  exports: [BinanceService],
})
export class BinanceModule {}
