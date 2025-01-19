import { Inject, Injectable } from '@nestjs/common';
import { InsuranceSide, InsuranceState, Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { PrismaService } from 'nestjs-prisma';
import { PriceService } from 'src/price/price.service';
import { MarketOverviewResults } from './type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class GeneralService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly priceService: PriceService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getStats() {
    const [totalUsers, resultCommon, totalPayback] = await Promise.all([
      this.prismaService.user.count(),
      this.prismaService.insurance.aggregate({
        where: {
          state: { not: InsuranceState.INVALID },
        },
        _sum: {
          q_covered: true,
        },
        _count: true,
      }),
      this.prismaService.pairMarketStat.aggregate({
        _sum: {
          payback: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalContracts: resultCommon._count,
      totalQCovered: resultCommon._sum.q_covered,
      totalPayback: totalPayback._sum.payback ?? 0,
    };
  }

  async getTransactions() {
    const select: Prisma.InsuranceSelect = {
      id: true,
      state: true,
      side: true,
      asset: true,
      unit: true,
      txhash: true,
      stateLogs: true,
      q_claim: true,
      margin: true,
      closedAt: true,
      createdAt: true,
      updatedAt: true,
    };
    const listBullInsurances = await this.prismaService.insurance.findMany({
      where: {
        state: {
          not: InsuranceState.INVALID,
        },
        side: InsuranceSide.BULL,
      },
      orderBy: {
        updatedAt: Prisma.SortOrder.desc,
      },
      take: 20,
      select,
    });

    const listBearInsurances = await this.prismaService.insurance.findMany({
      where: {
        state: {
          not: InsuranceState.INVALID,
        },
        side: InsuranceSide.BEAR,
      },
      orderBy: {
        updatedAt: Prisma.SortOrder.desc,
      },
      take: 20,
      select,
    });

    return {
      listBullInsurances,
      listBearInsurances,
    };
  }

  async getSmartContractStats() {
    const sumResult = await this.prismaService.insurance.aggregate({
      where: {
        state: InsuranceState.AVAILABLE,
      },
      _sum: {
        q_claim: true,
        margin: true,
      },
    });

    const q_refund = await this.prismaService.insurance.aggregate({
      where: {
        state: InsuranceState.REFUND_WAITING,
      },
      _sum: {
        margin: true,
      },
    });

    const q_claim = await this.prismaService.insurance.aggregate({
      where: {
        state: InsuranceState.REFUND_WAITING,
      },
      _sum: {
        q_claim: true,
      },
    });

    return {
      claimPool: sumResult._sum.q_claim ?? 0,
      marginPool: sumResult._sum.margin ?? 0,
      hakifiFund: 0,
      scilabsFund: 0,
      q_refund: q_refund._sum.margin ?? 0,
      q_claim: q_claim._sum.q_claim ?? 0,
    };
  }

  async getMarketOverview() {
    const {
      topContracts,
      topCoverAmount,
      topGainers,
      topPaybackUsers,
      symbols,
    } = await this._getMarketOverviewCached();

    const prices = await Promise.all(
      symbols.map(async (symbol) => {
        const prices = this.priceService.getTickerPrices(symbol) || {};
        return {
          symbol,
          ...prices,
        };
      }),
    );

    const pricesMap = prices.reduce((acc, item) => {
      acc[item.symbol] = item;
      return acc;
    }, {});

    return {
      topContracts: topContracts.map((item) => ({
        ...item,
        ...(pricesMap[item.symbol] || {}),
      })),
      topCoverAmount: topCoverAmount.map((item) => ({
        ...item,
        ...(pricesMap[item.symbol] || {}),
      })),
      topGainers: topGainers.map((item) => ({
        ...item,
        ...(pricesMap[item.symbol] || {}),
      })),
      topPaybackUsers,
    };
  }

  private async _getMarketOverviewCached(): Promise<MarketOverviewResults> {
    const cacheKey = 'market-overview';

    const cached = await this.cacheManager.get<MarketOverviewResults>(cacheKey);
    if (cached) {
      return cached;
    }
    const resultTopContracts = await this.prismaService.insurance.groupBy({
      by: ['asset', 'unit', 'side'],
      where: {
        state: {
          not: InsuranceState.INVALID,
        },
      },
      _count: {
        id: true,
      },
      take: 3,
      orderBy: {
        _count: {
          id: Prisma.SortOrder.desc,
        },
      },
    });

    const resultTopCoverAmount = await this.prismaService.insurance.groupBy({
      by: ['asset', 'unit', 'side'],
      where: {
        state: {
          not: InsuranceState.INVALID,
        },
      },
      _sum: {
        margin: true,
        q_covered: true,
      },
      take: 3,
      orderBy: {
        _sum: {
          q_covered: Prisma.SortOrder.desc,
        },
      },
    });

    const resultTopGainers = await this.prismaService.insurance.groupBy({
      by: ['asset', 'unit', 'side'],
      where: {
        state: {
          in: [InsuranceState.CLAIMED, InsuranceState.CLAIM_WAITING],
        },
      },
      _sum: {
        q_claim: true,
        margin: true,
      },
      take: 3,
      orderBy: {
        _sum: {
          q_claim: Prisma.SortOrder.desc,
        },
      },
    });

    let symbols: string[] = [];

    let topContracts = resultTopContracts.map((item) => {
      const symbol = `${item.asset}${item.unit}`;
      symbols.push(symbol);
      return {
        asset: item.asset,
        unit: item.unit,
        side: item.side,
        contracts: item._count.id,
        symbol,
      };
    });

    let topCoverAmount = resultTopCoverAmount.map((item) => {
      const symbol = `${item.asset}${item.unit}`;
      symbols.push(symbol);
      return {
        asset: item.asset,
        unit: item.unit,
        side: item.side,
        q_covered: item._sum.q_covered,
        margin: item._sum.margin,
        symbol,
      };
    });

    let topGainers = resultTopGainers.map((item) => {
      const symbol = `${item.asset}${item.unit}`;
      symbols.push(symbol);
      return {
        asset: item.asset,
        unit: item.unit,
        side: item.side,
        q_claim: item._sum.q_claim,
        margin: item._sum.margin,
        symbol,
      };
    });
    symbols = [...new Set(symbols)];
    const topPaybackUsers: any =
      await this.prismaService.insurance.aggregateRaw({
        pipeline: [
          {
            $match: {
              state: {
                $in: [
                  InsuranceState.CLAIMED,
                  InsuranceState.REFUNDED,
                  InsuranceState.CLAIM_WAITING,
                  InsuranceState.REFUND_WAITING,
                ],
              },
            },
          },
          {
            $group: {
              _id: '$userId',
              totalPayback: {
                $sum: {
                  $cond: [
                    {
                      $in: [
                        '$state',
                        [InsuranceState.CLAIMED, InsuranceState.CLAIM_WAITING],
                      ],
                    },
                    '$q_claim',
                    '$margin',
                  ],
                },
              },
              totalContracts: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              totalPayback: -1,
            },
          },
          {
            $limit: 3,
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'user',
              pipeline: [{ $project: { walletAddress: 1, _id: 0 } }],
            },
          },
        ],
      });
    const results: MarketOverviewResults = {
      topContracts,
      topCoverAmount,
      topGainers,
      topPaybackUsers: topPaybackUsers.map((item) => ({
        walletAddress: item.user[0]?.walletAddress,
        totalPayback: item.totalPayback,
        totalContracts: item.totalContracts,
      })),
      symbols,
    };

    await this.cacheManager.set(cacheKey, results, 10 * 60 * 1000);
    return results;
  }
}
