import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { GeneralService } from './general.service';
import { ApiTags } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('general')
@ApiTags('General')
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}

  @Get('stats')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000) // 1 minute
  getStats() {
    return this.generalService.getStats();
  }

  @Get('transactions')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000) // 1 minute
  getTrasactions() {
    return this.generalService.getTransactions();
  }

  @Get('smart-contract-stats')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000) // 1 minute
  getSmcStats() {
    return this.generalService.getSmartContractStats();
  }

  @Get('market-overview')
  getMarketOverview() {
    return this.generalService.getMarketOverview();
  }
}
