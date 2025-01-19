import { Module } from '@nestjs/common';
import { PairsService } from './pairs.service';
import { PairsController } from './pairs.controller';
import { PairsSchedule } from './pairs.schedule';
import { PriceModule } from 'src/price/price.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PriceModule, AuthModule],
  controllers: [PairsController],
  providers: [PairsService, PairsSchedule],
  exports: [PairsService],
})
export class PairsModule {}
