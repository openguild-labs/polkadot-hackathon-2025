import { Module } from '@nestjs/common';
import { AutionMarketService } from './aution_market.service';
import { AutionMarketController } from './aution_market.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AutionMarketController],
  providers: [AutionMarketService, PrismaService],
})
export class AutionMarketModule {}
