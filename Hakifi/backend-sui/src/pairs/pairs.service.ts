import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ListPairQueryDto } from './dto/token-query.dto';
import {
  Insurance,
  InsuranceSide,
  InsuranceState,
  InsurancePeriodUnit,
  Prisma,
} from '@prisma/client';
import { PriceService } from 'src/price/price.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { OnEvent } from '@nestjs/event-emitter';
import { INSURANCE_EVENTS } from 'src/common/constants/event';
import { CandleChartResult } from 'binance-api-node';
import { CONFIG_HEDGE_DIFF } from './pairs.contants';
import { round, sleep } from '../common/helpers/utils';
import Binance from 'binance-api-node';

@Injectable()
export class PairsService {
  private readonly logger = new Logger(PairsService.name);
  private readonly binance = Binance();

  constructor(
    private readonly prismaService: PrismaService,
    private readonly priceService: PriceService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    // this.convertData();
  }

  // private async convertData() {
  //   const pairConfig = await this.prismaService.pairConfig.findMany({
  //     where: {
  //       listHourChangeRatio: {
  //         isNot: {},
  //       },
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });
  //   await this.prismaService.pairConfig.updateMany({
  //     where: {
  //       id: {
  //         in: pairConfig.map((item) => item.id),
  //       },
  //     },
  //     data: {
  //       listHourChangeRatio: {},
  //     },
  //   });
  // }
  async findAll(path: string, query: ListPairQueryDto) {
    const cacheKey = (query.userId ? `${query.userId}:` : '') + path;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached;
    }

    const where: Prisma.PairWhereInput = {
      isActive: true,
    };
    const orderBy: Prisma.PairOrderByWithAggregationInput[] = query.orderBy ?? [
      { isHot: Prisma.SortOrder.desc },
      { symbol: Prisma.SortOrder.asc },
    ];

    if (query.q) {
      where.symbol = {
        contains: query.q,
        mode: 'insensitive',
      };
    }

    const [total, data] = await Promise.all([
      this.prismaService.pair.count({ where, orderBy }),
      this.prismaService.pair.findMany({
        skip: query.skip,
        take: query.limit,
        where,
        include: {
          token: {
            select: {
              attachment: true,
              id: true,
              tagIds: true,
              decimals: true,
            },
          },
        },
        orderBy,
      }),
    ]);

    const favoritesMap = new Map<string, boolean>();

    if (query.userId) {
      const favoritePairs = await this.prismaService.favoritePair.findMany({
        where: {
          userId: query.userId,
          symbol: {
            in: data.map((item) => item.symbol),
          },
        },
        select: {
          symbol: true,
        },
      });
      favoritePairs.forEach((item) => {
        favoritesMap.set(item.symbol, true);
      });
    }

    let rows = [];
    if (query.includePrice) {
      rows = data.map((item) => {
        const prices = this.priceService.getTickerPrices(item.symbol) || {};
        const isFavorite = !!query.userId
          ? favoritesMap.has(item.symbol) || false
          : undefined;
        return {
          ...item,
          ...prices,
          isFavorite,
        };
      });
    } else {
      rows = data.map((item) => {
        const isFavorite = !!query.userId
          ? favoritesMap.has(item.symbol) || false
          : undefined;
        return {
          ...item,
          isFavorite,
        };
      });
    }

    const result = {
      rows,
      total,
    };

    await this.cacheManager.set(cacheKey, result, 30 * 1000);

    return result;
  }

  async findOne(symbol: string) {
    symbol = symbol.trim().toUpperCase();

    const pair = await this.prismaService.pair.findUnique({
      where: { symbol },
      include: {
        token: {
          select: {
            id: true,
            symbol: true,
            attachment: true,
            decimals: true,
          },
        },
        config: {
          select: {
            listDayChangeRatio: true,
            listHourChangeRatio: true,
          },
        },
      },
    });

    if (!pair) {
      throw new NotFoundException('Symbol not found');
    }

    if (!pair.config) {
      throw new BadRequestException('Config for this pair is not found');
    }

    pair.config.listDayChangeRatio = pair.config.listDayChangeRatio.slice(
      0,
      15,
    );
    let lastPrice = null;
    try {
      lastPrice = await this.priceService.getFuturePrice(pair.symbol);
    } catch (error) {
      console.error('Error get price', error);
    }

    const priceChangePercent = this.priceService.getPriceChangePercent(
      pair.symbol,
    );

    return {
      ...pair,
      lastPrice,
      priceChangePercent,
    };
  }

  async getFavoritePairs(userId: string, query: ListPairQueryDto) {
    const where: Prisma.FavoritePairWhereInput = {
      userId,
    };

    if (query.q) {
      where.symbol = {
        contains: query.q,
        mode: 'insensitive',
      };
    }

    const orderBy: Prisma.FavoritePairOrderByWithRelationInput[] =
      query.orderBy ?? [
        { createdAt: Prisma.SortOrder.asc },
        { symbol: Prisma.SortOrder.asc },
      ];

    const [favoritePairs, total] = await Promise.all([
      this.prismaService.favoritePair.findMany({
        where: {
          userId,
        },
        select: {
          pair: {
            include: {
              token: {
                select: {
                  attachment: true,
                  id: true,
                  tagIds: true,
                  decimals: true,
                },
              },
            },
          },
        },
        orderBy,
        skip: query.skip,
        take: query.limit,
      }),
      this.prismaService.favoritePair.count({ where, orderBy }),
    ]);
    const pairs = favoritePairs.map((item) => item.pair);

    let rows = [];
    if (query.includePrice) {
      rows = pairs
        .filter((item) => !!item)
        .map((item) => {
          const prices = this.priceService.getTickerPrices(item.symbol) || {};
          return { ...item, ...prices };
        });
    } else {
      rows = pairs;
    }

    return {
      rows,
      total,
    };
  }

  async getAllFavoriteSymbols(userId: string) {
    const pairs = await this.prismaService.favoritePair.findMany({
      where: { userId },
      select: {
        symbol: true,
        id: false,
      },
    });
    return pairs.map((item) => item.symbol);
  }

  async addFavoritePair(userId: string, symbol: string) {
    const pair = await this.prismaService.pair.findUnique({
      where: {
        symbol,
      },
      select: {
        id: true,
      },
    });

    if (!pair) {
      throw new NotFoundException('Symbol not found');
    }

    const existed = await this.prismaService.favoritePair.findUnique({
      where: {
        userId_symbol: {
          symbol,
          userId,
        },
      },
    });

    if (existed) {
      throw new BadRequestException('Symbol already added');
    }

    const favoritePair = await this.prismaService.favoritePair.create({
      data: {
        userId,
        symbol,
      },
    });

    return favoritePair;
  }

  async addFavoritePairs(userId: string, symbols: string[]) {
    symbols = symbols.map((s) => s.toUpperCase());
    const pairs = await this.prismaService.pair.findMany({
      where: {
        symbol: {
          in: symbols,
        },
      },
      select: {
        id: true,
        symbol: true,
      },
    });

    const existeds = await this.prismaService.favoritePair.findMany({
      where: {
        userId,
        symbol: {
          in: pairs.map((p) => p.symbol),
        },
      },
    });

    const filterSymbols = symbols.filter(
      (s) => !existeds.find((e) => e.symbol === s),
    );

    if (filterSymbols.length === 0) {
      return {
        success: true,
      };
    }

    await this.prismaService.favoritePair.createMany({
      data: filterSymbols.map((symbol) => ({
        userId,
        symbol,
      })),
    });

    return {
      success: true,
    };
  }

  async removeFavoritePair(userId: string, symbol: string) {
    const existed = await this.prismaService.favoritePair.findUnique({
      where: {
        userId_symbol: {
          symbol,
          userId,
        },
      },
    });

    if (!existed) {
      throw new BadRequestException('Symbol not added yet');
    }

    const favoritePair = await this.prismaService.favoritePair.delete({
      where: {
        userId_symbol: {
          symbol,
          userId,
        },
      },
    });

    return favoritePair;
  }

  async getMarketPairs() {
    let results = [];
    const cacheKey = 'market_pairs';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      results = cached as Array<any>;
    } else {
      const defaultStat = {
        totalBear: 0,
        totalBull: 0,
        totalContract: 0,
        margin: 0,
        q_covered: 0,
        refunded: 0,
        claimed: 0,
        payback: 0,
      };

      const pairs = await this.prismaService.pair.findMany({
        where: {
          isActive: true,
        },
        include: {
          token: {
            select: {
              attachment: true,
              tagIds: true,
              decimals: true,
            },
          },
          marketStat: {
            select: {
              totalBear: true,
              totalBull: true,
              totalContract: true,
              margin: true,
              q_covered: true,
              refunded: true,
              claimed: true,
              payback: true,
            },
          },
        },
        orderBy: [
          { isHot: Prisma.SortOrder.desc },
          { symbol: Prisma.SortOrder.asc },
        ],
      });

      results = pairs.map(({ marketStat, ...pair }) => ({
        ...pair,
        ...(marketStat ?? defaultStat),
      }));
      await this.cacheManager.set(cacheKey, results, 10 * 60 * 1000);
    }

    return results.map((item) => ({
      ...item,
      ...(this.priceService.getTickerPrices(item.symbol) ?? {}),
    }));
  }

  @OnEvent(INSURANCE_EVENTS.CREATED)
  async updatePairMarketStatByCreated(insurance: Insurance) {
    const symbol = `${insurance.asset}${insurance.unit}`;
    let bull = 0;
    let bear = 0;
    if (insurance.side === InsuranceSide.BULL) {
      bull = 1;
    } else {
      bear = 1;
    }

    await this.prismaService.pairMarketStat.upsert({
      where: {
        symbol,
      },
      create: {
        symbol,
        asset: insurance.asset,
        unit: insurance.unit,
        totalBull: bull,
        totalBear: bear,
        totalContract: 1,
        margin: insurance.margin,
        q_covered: insurance.q_covered,
      },
      update: {
        totalBull: {
          increment: bull,
        },
        totalBear: {
          increment: bear,
        },
        totalContract: {
          increment: 1,
        },
        margin: {
          increment: insurance.margin,
        },
        q_covered: {
          increment: insurance.q_covered,
        },
      },
    });
  }

  @OnEvent(INSURANCE_EVENTS.UPDATED, { async: true, nextTick: true })
  async updatePairMarketStatByUpdated(insurance: Insurance) {
    const symbol = `${insurance.asset}${insurance.unit}`;
    let claimed = 0,
      refunded = 0;
    switch (insurance.state) {
      case InsuranceState.CLAIM_WAITING:
        claimed = insurance.q_claim;
        break;
      case InsuranceState.REFUND_WAITING:
        refunded = insurance.margin;
        break;
      default:
        return;
    }

    await this.prismaService.pairMarketStat.update({
      where: {
        symbol,
      },
      data: {
        claimed: {
          increment: claimed,
        },
        refunded: {
          increment: refunded,
        },
        payback: {
          increment: refunded + claimed,
        },
      },
    });
  }

  async getConfigPeriod(pair) {
    const result = [];
    const listHourChangeRatios = pair.config.listHourChangeRatio;
    for (const i in listHourChangeRatios) {
      if (listHourChangeRatios[i]) {
        result.push({
          period: parseInt(i),
          periodUnit: InsurancePeriodUnit.HOUR,
          periodChangeRatio: listHourChangeRatios[i],
        });
      }
    }

    for (let i = 0; i < 15; i++) {
      if (pair.config.listDayChangeRatio[i]) {
        result.push({
          period: i + 1,
          periodUnit: InsurancePeriodUnit.DAY,
          periodChangeRatio: pair.config.listDayChangeRatio[i],
        });
      }
    }

    return result;
  }

  async updateDayChangeAvgConfig() {
    this.logger.log('Updating day change ratio');
    const pairs = await this.prismaService.pair.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        symbol: true,
      },
    });
    const endTime = Date.now();

    for (const pair of pairs) {
      let candles: CandleChartResult[] = [];
      try {
        candles = await this.binance.futuresCandles({
          interval: '8h',
          symbol: pair.symbol,
          limit: 3,
          endTime,
        });
      } catch (error) {
        this.logger.warn(
          `Symbol: ${pair.symbol} | futuresCandles Error: ` + error.message,
        );
        continue;
      }

      let avgChange = 0.03; // initital value

      candles.forEach((candle) => {
        const high = parseFloat(candle.high);
        const low = parseFloat(candle.low);
        const perc = +((high - low) / high).toFixed(4);
        avgChange = perc > avgChange ? perc : avgChange;
      });

      const avgChangeDiff = 0.85 * avgChange;

      const listDayChangeRatio: number[] = [];
      // according https://docs.google.com/spreadsheets/d/14k1w2-hhCXC8US0_HrQfq05-IblSwVheI0Xyn-KUvwI/edit#gid=968520987
      for (let i = 1; i <= 365; i++) {
        let ratioChange = 0;
        if (i === 1) {
          ratioChange = avgChange;
        } else if (i >= 2 && i <= 15) {
          ratioChange = avgChange + avgChangeDiff * (i - 1);
        } else if (i <= 20) {
          ratioChange = CONFIG_HEDGE_DIFF.D16_D20 * avgChange;
        } else if (i <= 27) {
          ratioChange = CONFIG_HEDGE_DIFF.D21_D27 * avgChange;
        } else if (i <= 30) {
          ratioChange = CONFIG_HEDGE_DIFF.D28_D30 * avgChange;
        } else if (i <= 365) {
          ratioChange = CONFIG_HEDGE_DIFF.D31_D365 * avgChange;
        }

        listDayChangeRatio.push(round(ratioChange, 5));
      }

      try {
        await this.prismaService.pairConfig.upsert({
          where: {
            symbol: pair.symbol,
          },
          update: {
            listDayChangeRatio,
          },
          create: {
            symbol: pair.symbol,
            listDayChangeRatio,
            listHourChangeRatio: {},
          },
        });
      } catch (error) {
        this.logger.error('Update Pair Config Error: ' + error.message);
      }

      await sleep(100);
    }
  }

  async updateHourChangeAvgConfig(period: '12' | '4' | '1') {
    this.logger.log('UPDATING HOUR CHANGE TOKEN');

    const pairs = await this.prismaService.pair.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        symbol: true,
      },
    });
    const endTime = Date.now();
    let threshold;

    for (const pair of pairs) {
      let candles: CandleChartResult[] = [];
      try {
        switch (period) {
          case '12':
            candles = await this.binance.futuresCandles({
              interval: '4h',
              symbol: pair.symbol,
              limit: 8,
              endTime,
            });

            threshold = 0.03;
            break;
          case '4':
            candles = await this.binance.futuresCandles({
              interval: '1h',
              symbol: pair.symbol,
              limit: 10,
              endTime,
            });

            threshold = 0.025;
            break;
          case '1':
            candles = await this.binance.futuresCandles({
              interval: '15m',
              symbol: pair.symbol,
              limit: 11,
              endTime,
            });

            threshold = 0.022;
            break;
        }
      } catch (error) {
        this.logger.warn(
          `Symbol: ${pair.symbol} | futuresCandles Error: ` + error.message,
        );
        continue;
      }

      let avgChange = 0;

      candles.forEach((candle) => {
        const high = parseFloat(candle.high);
        const low = parseFloat(candle.low);
        const perc = +((high - low) / high).toFixed(4);
        avgChange = perc > avgChange ? perc : avgChange;
      });
      avgChange = avgChange > threshold ? avgChange : threshold;

      try {
        await this.prismaService.pairConfig.upsert({
          where: {
            symbol: pair.symbol,
          },
          update: {
            listHourChangeRatio: {
              update: {
                [`${period}`]: avgChange,
              },
            },
          },
          create: {
            symbol: pair.symbol,
            listHourChangeRatio: {
              [`${period}`]: avgChange,
            },
            listDayChangeRatio: [],
          },
        });
      } catch (error) {
        console.log(error);
        this.logger.error('Update Pair Config Error: ' + error.message);
      }

      await sleep(100);
    }
  }
}
