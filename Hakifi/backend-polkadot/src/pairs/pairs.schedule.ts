import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'nestjs-prisma';
import { PairsService } from './pairs.service';

@Injectable()
export class PairsSchedule {
  private readonly logger = new Logger(PairsSchedule.name);
  constructor(private readonly pairsService: PairsService) {}

  @Cron('*/1 * * * *') // every 10 minutes
  async cronUpdateDayChangeRatio() {
    this.logger.log('Job: cronUpdateDayChangeRatio');

    const date = new Date();
    const minute = date.getMinutes();

    switch (minute) {
      case 1:
        //Run config day at minute 1 every hour
        await this.pairsService.updateDayChangeAvgConfig();
        break;
      case 2:
        //Run config period 4h as candle 1h at minutes 2
        await this.pairsService.updateHourChangeAvgConfig('4');
        break;
      case 3:
        //Run config period 12h as candle 4h at minutes 3
        await this.pairsService.updateHourChangeAvgConfig('12');
        break;
      default:
        break;
    }

    //Run config hour 1 every 15 minute
    if (minute % 15 == 0) {
      await this.pairsService.updateHourChangeAvgConfig('1');
    }
  }
}
