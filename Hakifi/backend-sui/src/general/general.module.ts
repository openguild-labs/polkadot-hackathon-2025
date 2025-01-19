import { Module } from '@nestjs/common';
import { GeneralService } from './general.service';
import { GeneralController } from './general.controller';
import { InsurancesModule } from 'src/insurances/insurances.module';
import { PriceModule } from 'src/price/price.module';

@Module({
  imports: [InsurancesModule, PriceModule],
  controllers: [GeneralController],
  providers: [GeneralService],
})
export class GeneralModule {}
