import { Module } from '@nestjs/common';
import { SuiService } from './sui.service';

@Module({
  providers: [SuiService],
  exports: [SuiService],
})
export class SuiModule {}
