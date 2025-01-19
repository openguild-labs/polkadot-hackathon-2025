import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('binance')
@ApiTags('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}
}
