import { Controller, Get, Param } from '@nestjs/common';
import { PriceService } from './price.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('price')
@ApiTags('Price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get(':symbol')
  @ApiParam({ name: 'symbol', example: 'BNBUSDT' })
  getSymbolPrice(@Param('symbol') symbol: string) {
    return this.priceService.getFuturePrice(symbol);
  }
}
