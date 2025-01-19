import { Injectable } from '@nestjs/common';
import { isMongoId } from 'class-validator';

import { Command, Positional } from 'nestjs-command';
import { PrismaService } from 'nestjs-prisma';
import { BinanceService } from './binance.service';

@Injectable()
export class BinanceCommand {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly binanceService: BinanceService,
  ) {}

  @Command({
    command: 'binance:close_order',
    describe: 'Close order insurance on Binance',
  })
  async closeOrderInsurance(
    @Positional({
      name: 'insuranceId',
      describe: 'Insurance Id',
      type: 'string',
    })
    insuranceId: string,
  ) {
    if (!isMongoId(insuranceId)) {
      console.error(`Invalid insuranceId: ${insuranceId}`);
      return;
    }
    const insurance = await this.prismaService.insurance.findUnique({
      where: {
        id: insuranceId,
      },
    });

    if (!insurance) {
      console.error(`Insurance not found: ${insuranceId}`);
      return;
    }
    try {
      await this.binanceService.closeOrder(insurance);
      console.log(`Closed order insurance: ${insuranceId}`);
    } catch (error) {
      console.error(`Error close order insurance: ${insuranceId}`, error);
    }
  }
}
