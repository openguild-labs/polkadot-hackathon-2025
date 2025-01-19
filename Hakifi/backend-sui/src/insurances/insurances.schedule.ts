import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { InsuranceSide, InsuranceState } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import dayjs from 'dayjs';
import { InsuranceContractService } from './insurance-contract.service';
import {
  INVALID_REASONS,
  RATIO_DIFF_VALID_PRICE,
} from './constant/insurance.contant';
import { diff, inRange, uniq } from 'src/common/helpers/utils';
import { PriceService } from 'src/price/price.service';
import { BinanceService } from 'src/binance/binance.service';
import { FuturesUserTradeResult } from 'binance-api-node';

@Injectable()
export class InsuranceSchedule {
  logger = new Logger(InsuranceSchedule.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly insuranceContractService: InsuranceContractService,
    private readonly priceService: PriceService,
    private readonly binanceService: BinanceService,
  ) {}

  @Interval(1000 * 15) // 15s
  async checkPendingInsurances() {
    const insurances = await this.prismaService.insurance.findMany({
      where: {
        state: InsuranceState.PENDING,
      },
      include: {
        user: {
          select: {
            walletAddress: true,
          },
        },
      },
    });

    if (!insurances.length) return;

    insurances.forEach(async (insurance) => {
      try {
        const insuranceContract =
          await this.insuranceContractService.getInsuranceContract(
            insurance.id,
          );

        const symbol = `${insurance.asset}${insurance.unit}`;

        const currentPrice = await this.priceService.getFuturePrice(symbol);

        if (
          diff(currentPrice, insurance.p_open) / insurance.p_open >
          RATIO_DIFF_VALID_PRICE
        ) {
          this.insuranceContractService.invalidateInsurance(
            insurance.id,
            INVALID_REASONS.INVALID_PRICE,
            !!insuranceContract,
            insuranceContract?.address,
          );
          return;
        }

        if (!insuranceContract) return;

        let invalidReason;
        if (insuranceContract.margin !== insurance.margin)
          invalidReason = INVALID_REASONS.INVALID_MARGIN;
        else if (insurance.user?.walletAddress !== insuranceContract.address)
          invalidReason = INVALID_REASONS.INVALID_WALLET_ADDRESS;
        else if (insurance.unit !== insuranceContract.unit)
          invalidReason = INVALID_REASONS.INVALID_UNIT;

        if (!!invalidReason) {
          this.insuranceContractService.invalidateInsurance(
            insurance.id,
            invalidReason,
            false,
            insuranceContract.address,
          );
          return;
        }

        this.insuranceContractService.availableInsurance(insurance);
      } catch (error) {
        this.logger.warn("Can't get insurance contract: " + error.message);
      }
    });
  }

  @Cron('*/10 * * * * *') // 10s
  async checkAvailableInsurances() {
    const insurances = await this.prismaService.insurance.findMany({
      where: {
        state: InsuranceState.AVAILABLE,
      },
    });

    if (!insurances.length) return;

    const symbols = insurances.map(
      (insurance) => `${insurance.asset}${insurance.unit}`,
    );

    const checkPricesMap = this.priceService.getCheckPrices(symbols);
    this.priceService.resetAllCheckPrices();

    const listCheckExpired: typeof insurances = [];

    // ================== Start Check Claimed Or Liquidation ==================

    // Check Insurance Claimed;
    insurances.forEach(async (insurance) => {
      const symbol = `${insurance.asset}${insurance.unit}`;
      let prices = checkPricesMap.get(symbol) || [];
      const expiredTime = dayjs(insurance.expiredAt).valueOf();
      const startTime = dayjs(insurance.createdAt).valueOf();
      const side = insurance.side;

      const listPrices = prices.reduce((list, p) => {
        if (p.t > startTime && p.t < expiredTime) {
          list.push(p.p);
        }
        return list;
      }, []);
      if (!listPrices.length) {
        listCheckExpired.push(insurance);
        return;
      }

      const min = Math.min(...listPrices);
      const max = Math.max(...listPrices);
      if (
        (side == InsuranceSide.BEAR && min <= insurance.p_claim) ||
        (side == InsuranceSide.BULL && max >= insurance.p_claim)
      ) {
        // Claim
        try {
          await this.insuranceContractService.claimInsurance(
            insurance,
            side == InsuranceSide.BEAR ? min : max,
          );
        } catch (error) {
          this.logger.error('Error when claimInsurance: ' + error.message);
        }
      } else if (
        (side === InsuranceSide.BEAR && max >= insurance.p_liquidation) ||
        (side === InsuranceSide.BULL && min <= insurance.p_liquidation)
      ) {
        // Liquidation
        try {
          await this.insuranceContractService.liquidatedOrExpiredInsurance(
            insurance,
            InsuranceState.LIQUIDATED,
            side == InsuranceSide.BEAR ? max : min,
          );
        } catch (error) {
          this.logger.error('Error when liquidateInsurance: ' + error.message);
        }
      } else {
        listCheckExpired.push(insurance);
      }
    });

    // ================== Start Check Expired Or Refund ==================

    const checkTime = Date.now();
    // Check Insurance Expired
    listCheckExpired.forEach(async (insurance) => {
      const symbol = `${insurance.asset}${insurance.unit}`;

      if (dayjs(insurance.expiredAt).valueOf() > checkTime) return;

      const currentPrice = await this.priceService.getFuturePrice(symbol);

      if (inRange(currentPrice, insurance.p_claim, insurance.p_refund)) {
        // Refund
        try {
          await this.insuranceContractService.refundInsurance(
            insurance,
            currentPrice,
          );
        } catch (error) {
          this.logger.error('Error when refundInsurance: ' + error.message);
        }
      } else {
        // Expired
        try {
          await this.insuranceContractService.liquidatedOrExpiredInsurance(
            insurance,
            InsuranceState.EXPIRED,
            currentPrice,
          );
        } catch (error) {
          this.logger.error('Error when expiredInsurance: ' + error.message);
        }
      }
    });
  }

  @Cron('*/5 * * * *') // 5m
  async checkWaitingInsurances() {
    const insurances = await this.prismaService.insurance.findMany({
      where: {
        state: {
          in: [InsuranceState.CLAIM_WAITING, InsuranceState.REFUND_WAITING],
        },
      },
    });
    this.logger.log(
      `Starting checkWaitingInsurances... (${insurances.length})`,
    );
    if (!insurances.length) return;

    for (const insurance of insurances) {
      try {
        const insuranceContract =
          await this.insuranceContractService.getInsuranceContract(
            insurance.id,
          );
        if (!insuranceContract) continue;
        this.logger.debug(insuranceContract);
        const current = new Date();
        switch (insuranceContract.state) {
          case 0:
            await this.insuranceContractService.availableContractInsurance(
              insurance,
            );
          case 1:
            if (dayjs(insurance.closedAt).diff(current, 'minutes') > 30) {
              // retry refund or claim
              switch (insurance.state) {
                case InsuranceState.REFUND_WAITING:
                  await this.insuranceContractService.refundContractInsurance(
                    insurance,
                  );
                  break;
                case InsuranceState.CLAIM_WAITING:
                  await this.insuranceContractService.claimContractInsurance(
                    insurance,
                  );
                  break;
                default:
                  break;
              }
            }
          // case 'CLAIMED':
          //   await this.insuranceContractService.onContractStateChanged(
          //     insurance.id,
          //     InsuranceState.CLAIMED,
          //   );
          //   break;
          // case 'REFUNDED':
          //   await this.insuranceContractService.onContractStateChanged(
          //     insurance.id,
          //     InsuranceState.REFUNDED,
          //   );
          //   break;
          default:
            break;
        }
      } catch (error) {
        this.logger.error(
          'Error when checkWaitingInsurances: ' + error.message,
        );
      }
    }
  }

  @Cron('30 */5 * * * *') // 5m
  async calculatePnlBinanceInsurances() {
    const insuranceBinances =
      await this.prismaService.binanceInsurance.findMany({
        where: {
          isCalculatedPnl: false,
        },
        include: {
          insurance: {
            select: {
              asset: true,
              unit: true,
              pnlUser: true,
            },
          },
        },
      });
    if (!insuranceBinances.length) return;

    const accountSymbols = new Map<
      number,
      {
        symbols: string[];
        startTime: number;
      }
    >();

    insuranceBinances.forEach(async (insb) => {
      const symbol = `${insb.insurance.asset}${insb.insurance.unit}`;
      if (accountSymbols.has(insb.binanceAccountId)) {
        const item = accountSymbols.get(insb.binanceAccountId);
        item.symbols = uniq([...item.symbols, symbol]);
        const time = dayjs(insb.lastScanPnl).valueOf();
        if (time < item.startTime) {
          item.startTime = time;
        }
      } else {
        accountSymbols.set(insb.binanceAccountId, {
          symbols: [symbol],
          startTime: dayjs(insb.lastScanPnl).valueOf(),
        });
      }
    });

    const processInsuranceIds: string[] = [];

    for (const accountId of accountSymbols.keys()) {
      const item = accountSymbols.get(accountId);

      const client = await this.binanceService.getAccountClient(accountId);
      if (!client) return;
      const now = Date.now();
      for (const symbol of item.symbols) {
        const userTrades: FuturesUserTradeResult[] = [];
        let startTime = item.startTime;
        while (startTime < now) {
          const endTime = Math.min(startTime + 7 * 24 * 60 * 60 * 1000, now);
          try {
            const userTradesResult = await client.futuresUserTrades({
              symbol,
              startTime,
              endTime,
            });
            console.log(userTradesResult);

            userTrades.push(...userTradesResult);
          } catch (error) {
            this.logger.error('Error when get user trades: ' + error.message);
          }
          startTime = endTime;
        }

        if (!userTrades.length) continue;
        for (const userTrade of userTrades) {
          const binanceInsurance = insuranceBinances.find((insb) => {
            return (
              insb.slOrderId === userTrade.orderId ||
              insb.tpOrderId === userTrade.orderId ||
              insb.closeOrderId === userTrade.orderId
            );
          });

          if (!binanceInsurance) continue;
          processInsuranceIds.push(binanceInsurance.insuranceId);

          const pnlBinance = Number(userTrade.realizedPnl);
          try {
            await this.prismaService.$transaction([
              this.prismaService.insurance.update({
                where: {
                  id: binanceInsurance.insuranceId,
                },
                data: {
                  pnlProject: pnlBinance - binanceInsurance.insurance.pnlUser,
                  pnlBinance,
                },
              }),
              this.prismaService.binanceInsurance.update({
                where: {
                  insuranceId: binanceInsurance.insuranceId,
                },
                data: {
                  pnl: pnlBinance,
                  isCalculatedPnl: true,
                  lastScanPnl: new Date(),
                },
              }),
            ]);
          } catch (error) {
            this.logger.error(
              'Error when update pnl binance insurances: ' + error.message,
            );
          }
        }
      }
    }

    await this.prismaService.binanceInsurance.updateMany({
      where: {
        insuranceId: {
          in: insuranceBinances
            .map((insb) => insb.insuranceId)
            .filter(
              (insuranceId) => !processInsuranceIds.includes(insuranceId),
            ),
        },
      },
      data: {
        lastScanPnl: new Date(),
      },
    });
  }
}
