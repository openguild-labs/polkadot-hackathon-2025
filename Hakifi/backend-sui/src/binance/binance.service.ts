import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  BinanceAccount,
  BinanceOrderLogStatus,
  Insurance,
  InsuranceSide,
  InsuranceState,
  PositionSide,
  Prisma,
} from '@prisma/client';
import BinanceClient, { OrderStatus, OrderType } from 'binance-api-node';
import type { Binance, FuturesOrder } from 'binance-api-node';
import { PrismaService } from 'nestjs-prisma';
import { TestnetBinance } from './binance.constant';
import {
  CreateMarketOrderDto,
  CreateSLTPOrderDto,
} from './dto/binance-order.dto';
import { round } from 'src/common/helpers/utils';

@Injectable()
export class BinanceService implements OnModuleInit {
  private readonly logger = new Logger(BinanceService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async onModuleInit() {
    const acounts = await this.getAccounts();
    if (acounts.length === 0) {
      this.logger.warn('No active Binance accounts found');
    }

    for (const account of acounts) {
      const client = this.getClient(account);
      try {
        const positionModeResult = await client.futuresPositionMode();

        if (!positionModeResult.dualSidePosition) {
          await client.futuresPositionModeChange({
            dualSidePosition: 'true',
            recvWindow: 5000,
          });
          this.logger.log(
            `Account #${account.id} Position mode changed to HEDGE`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Account #${account.id} get posision mode failed, error: ${error.message}`,
        );
      }
    }
  }

  public getClient(account: BinanceAccount) {
    let options = {
      apiKey: account.apiKey,
      apiSecret: account.apiSecret,
    };
    if (account.isTestnet) {
      options = { ...options, ...TestnetBinance };
    }

    return BinanceClient(options);
  }

  async getAccountClient(accountId: number) {
    const account = await this.prismaService.binanceAccount.findUnique({
      where: { id: accountId },
    });
    if (!account) return null;
    return this.getClient(account);
  }

  async getAccounts() {
    const accounts = await this.prismaService.binanceAccount.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        id: Prisma.SortOrder.asc,
      },
    });
    return accounts;
  }

  async order(insurance: Insurance) {
    const symbol = `${insurance.asset}${insurance.unit}`;

    const [accounts, pair] = await Promise.all([
      this.getAccounts(),
      this.prismaService.pair.findUnique({
        where: { symbol },
      }),
    ]);

    if (!accounts.length) {
      this.logger.error('No active Binance accounts found');
      return;
    }

    if (!pair) {
      this.logger.error(`Pair ${symbol} not found`);
      return;
    }

    if (insurance.state !== InsuranceState.AVAILABLE) {
      this.logger.error(
        `Insurance ${insurance.id} is not available to order Binance`,
      );
      return;
    }

    if (!insurance.futureQuantity) {
      this.logger.error(`Insurance ${insurance.id} future quantity is not set`);
      return;
    }

    const logs: Prisma.BinanceOrderLogCreateManyInput[] = [];

    const quantity = round(
      insurance.futureQuantity,
      pair.quantityPrecision,
    ).toString();

    const tpPrice = round(insurance.p_claim, pair.pricePrecision).toString();
    const slPrice = round(
      insurance.p_liquidation,
      pair.pricePrecision,
    ).toString();
    const positionSide =
      insurance.side === InsuranceSide.BULL ? 'LONG' : 'SHORT';

    for (const account of accounts) {
      const orders: FuturesOrder[] = [];

      const client = this.getClient(account);
      // Create Order Market;

      let openOrderId: number, slOrderId: number, tpOrderId: number;
      try {
        const openOrder = await this.createMarketOrder(client, {
          positionSide,
          quantity,
          symbol,
          insuranceId: insurance.id,
        });
        orders.push(openOrder);
        openOrderId = openOrder.orderId;
        logs.push({
          accountId: account.id,
          insuranceId: insurance.id,
          status: BinanceOrderLogStatus.SUCCESS,
          orderType: OrderType.MARKET,
          positionSide,
          quantity,
          side: openOrder.side,
          orderId: openOrder.orderId,
          symbol,
        });
      } catch (error) {
        logs.push({
          accountId: account.id,
          insuranceId: insurance.id,
          errorMessage: error.message,
          status: BinanceOrderLogStatus.FAILED,
          orderType: OrderType.MARKET,
          symbol,
          positionSide,
          side: positionSide === 'LONG' ? 'BUY' : 'SELL',
          quantity,
        });
        this.logger.error(
          `Account #${account.id} create order failed, error: ${error.message}`,
        );
        continue;
      }

      // Create Order SL
      try {
        const orderSl = await this.createOrderSL(client, {
          positionSide,
          quantity,
          symbol,
          stopPrice: slPrice,
          insuranceId: insurance.id,
        });
        slOrderId = orderSl.orderId;
        orders.push(orderSl);
        logs.push({
          accountId: account.id,
          insuranceId: insurance.id,
          status: BinanceOrderLogStatus.SUCCESS,
          orderType: OrderType.STOP_MARKET,
          symbol,
          quantity,
          positionSide,
          side: orderSl.side,
          orderId: orderSl.orderId,
          metadata: {
            slPrice,
          },
        });
      } catch (error) {
        logs.push({
          accountId: account.id,
          insuranceId: insurance.id,
          errorMessage: error.message,
          status: BinanceOrderLogStatus.FAILED,
          orderType: OrderType.STOP_MARKET,
          symbol,
          quantity,
          side: positionSide === 'LONG' ? 'SELL' : 'BUY',
          positionSide,
          metadata: {
            slPrice,
          },
        });
        this.logger.error(
          `Account #${account.id} create SL order failed, error: ${error.message}`,
        );
      }

      // Create Order TP
      try {
        const orderTp = await this.createOrderTP(client, {
          positionSide,
          quantity,
          symbol,
          stopPrice: tpPrice,
          insuranceId: insurance.id,
        });
        tpOrderId = orderTp.orderId;
        orders.push(orderTp);
        logs.push({
          accountId: account.id,
          insuranceId: insurance.id,
          status: BinanceOrderLogStatus.SUCCESS,
          orderType: OrderType.TAKE_PROFIT_MARKET,
          symbol,
          quantity,
          side: orderTp.side,
          positionSide,
          orderId: orderTp.orderId,
          metadata: {
            tpPrice,
          },
        });
      } catch (error) {
        logs.push({
          accountId: account.id,
          insuranceId: insurance.id,
          errorMessage: error.message,
          status: BinanceOrderLogStatus.FAILED,
          orderType: OrderType.TAKE_PROFIT_MARKET,
          symbol,
          quantity,
          side: positionSide === 'LONG' ? 'SELL' : 'BUY',
          positionSide,
          metadata: {
            tpPrice,
          },
        });
        this.logger.error(
          `Account #${account.id} create TP order failed, error: ${error.message}`,
        );
      }
      // Save orders to database
      try {
        await this.prismaService.binanceOrder.createMany({
          data: orders.map((order) => ({
            insuranceId: insurance.id,
            binanceAccountId: account.id,
            ...this.binanceOrderToPrismaOrder(order),
          })),
        });
      } catch (error) {
        this.logger.error(
          `Account #${account.id} create orders failed, error: ${error.message}`,
        );
      }

      try {
        await this.prismaService.$transaction([
          this.prismaService.insurance.update({
            where: { id: insurance.id },
            data: { isTransferBinance: true },
          }),
          this.prismaService.binanceInsurance.create({
            data: {
              insuranceId: insurance.id,
              openOrderId,
              slOrderId,
              tpOrderId,
              quantity,
              binanceAccountId: account.id,
              symbol,
            },
          }),
        ]);
      } catch (error) {
        this.logger.error(
          `Insurance ${insurance.id} update binance data failed, error: ${error.message}`,
        );
      }
      break;
    }

    try {
      await this.prismaService.binanceOrderLog.createMany({
        data: logs,
      });
    } catch (error) {
      this.logger.error(`Create order log failed, error: ${error.message}`);
    }
  }

  async closeOrder(insurance: Insurance) {
    if (!insurance.isTransferBinance) {
      return;
    }
    const logs: Prisma.BinanceOrderLogCreateManyInput[] = [];

    const binanceInsurance =
      await this.prismaService.binanceInsurance.findUnique({
        where: { insuranceId: insurance.id },
      });

    if (!binanceInsurance) {
      this.logger.error(`Insurance ${insurance.id} not found in Binance`);
      return;
    }

    const account = await this.prismaService.binanceAccount.findUnique({
      where: { id: binanceInsurance.binanceAccountId },
    });

    if (!account) {
      this.logger.error(
        `Account #${binanceInsurance.binanceAccountId} not found`,
      );
      return;
    }

    const client = this.getClient(account);
    const closeClientOrderId = `${insurance.id}_CLOSE`;
    const symbol = `${insurance.asset}${insurance.unit}`;
    try {
      const existedCloseOrder = await this.prismaService.binanceOrder.count({
        where: {
          OR: [
            { clientOrderId: closeClientOrderId },
            {
              orderId: {
                in: [
                  binanceInsurance.tpOrderId,
                  binanceInsurance.slOrderId,
                ].filter((id) => !!id),
              },
              status: OrderStatus.FILLED,
            },
          ],
        },
      });
      if (existedCloseOrder === 0 && binanceInsurance.openOrderId !== null) {
        const openOrder = await this.prismaService.binanceOrder.findUnique({
          where: { orderId: binanceInsurance.openOrderId },
        });
        if (!openOrder) {
          this.logger.error(
            `Open order ${binanceInsurance.openOrderId} not found`,
          );
        }
        const positionSide = openOrder.positionSide;
        const side = positionSide === 'LONG' ? 'SELL' : 'BUY';
        try {
          const closeOrder = await client.futuresOrder({
            symbol: openOrder.symbol,
            side,
            newClientOrderId: closeClientOrderId,
            type: OrderType.MARKET,
            quantity: openOrder.origQty,
            positionSide,
          });

          await this.prismaService.$transaction([
            this.prismaService.binanceOrder.create({
              data: {
                insuranceId: insurance.id,
                binanceAccountId: account.id,
                ...this.binanceOrderToPrismaOrder(closeOrder),
              },
            }),
            this.prismaService.binanceInsurance.update({
              where: { insuranceId: insurance.id },
              data: {
                closeOrderId: closeOrder.orderId,
              },
            }),
          ]);
          logs.push({
            accountId: account.id,
            insuranceId: insurance.id,
            status: BinanceOrderLogStatus.SUCCESS,
            orderType: OrderType.MARKET,
            positionSide,
            quantity: closeOrder.origQty,
            side: closeOrder.side,
            orderId: closeOrder.orderId,
            symbol: closeOrder.symbol,
          });
        } catch (error) {
          logs.push({
            accountId: account.id,
            insuranceId: insurance.id,
            errorMessage: error.message,
            status: BinanceOrderLogStatus.FAILED,
            orderType: OrderType.MARKET,
            symbol: openOrder.symbol,
            positionSide: openOrder.positionSide,
            side,
            quantity: binanceInsurance.quantity,
          });
          this.logger.error(
            `Account #${account.id} create close order failed, error: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Account #${account.id} get close order failed, error: ${error.message}`,
      );
    }

    // Cancel SL and TP orders
    try {
      const orders = await client.futuresCancelBatchOrders({
        symbol,
        orderIdList: JSON.stringify(
          [binanceInsurance.slOrderId, binanceInsurance.tpOrderId].filter(
            (id) => !!id,
          ),
        ),
      });

      const updateOrders = orders.filter((order) => !!order.orderId);
      await this.prismaService.binanceOrder.updateMany({
        where: {
          orderId: {
            in: updateOrders.map((order) => order.orderId),
          },
        },
        data: {
          status: OrderStatus.CANCELED,
        },
      });
    } catch (error) {
      this.logger.error("Can't cancel SL and TP orders: ", error.message);
    }
  }

  private binanceOrderToPrismaOrder(order: FuturesOrder) {
    return {
      orderId: order.orderId,
      positionSide: order.positionSide as PositionSide,
      clientOrderId: order.clientOrderId,
      cumQty: order.cumQty,
      cumQuote: order.cumQuote,
      executedQty: order.executedQty,
      avgPrice: order.avgPrice,
      origQty: order.origQty,
      price: order.price,
      reduceOnly: order.reduceOnly,
      side: order.side,
      status: order.status,
      stopPrice: order.stopPrice,
      closePosition: order.closePosition,
      symbol: order.symbol,
      timeInForce: order.timeInForce,
      type: order.type,
      origType: order.origType,
      activatePrice: order.activatePrice,
      priceRate: order.priceRate,
      updateTime: order.updateTime,
      workingType: order.workingType,
    };
  }

  private async createMarketOrder(client: Binance, data: CreateMarketOrderDto) {
    const openOrder = await client.futuresOrder({
      symbol: data.symbol,
      side: data.positionSide === 'LONG' ? 'BUY' : 'SELL',
      newClientOrderId: `${data.insuranceId}_OPEN`,
      type: OrderType.MARKET,
      quantity: data.quantity,
      positionSide: data.positionSide,
    });

    return openOrder;
  }

  private async createOrderSL(client: Binance, data: CreateSLTPOrderDto) {
    const orderSl = await client.futuresOrder({
      symbol: data.symbol,
      side: data.positionSide === 'LONG' ? 'SELL' : 'BUY',
      newClientOrderId: `${data.insuranceId}_SL`,
      positionSide: data.positionSide,
      type: OrderType.STOP_MARKET,
      stopPrice: data.stopPrice,
      quantity: data.quantity,
      priceProtect: 'TRUE',
    });

    return orderSl;
  }

  private async createOrderTP(client: Binance, data: CreateSLTPOrderDto) {
    const orderTp = await client.futuresOrder({
      symbol: data.symbol,
      newClientOrderId: `${data.insuranceId}_TP`,
      side: data.positionSide === 'LONG' ? 'SELL' : 'BUY',
      positionSide: data.positionSide,
      type: OrderType.TAKE_PROFIT_MARKET,
      stopPrice: data.stopPrice,
      quantity: data.quantity,
      priceProtect: 'TRUE',
    });

    return orderTp;
  }

  private async getTradeInfo(client: Binance, symbol: string) {
    const trades = await client.futuresUserTrades({
      symbol,
      orderId: 1,
    } as any);

    return trades;
  }

  public async calculatePnlBinance(insurance: Insurance) {
    const binanceInsurance =
      await this.prismaService.binanceInsurance.findUnique({
        where: { insuranceId: insurance.id },
        include: {
          binanceAccount: true,
        },
      });

    if (!binanceInsurance) {
      this.logger.error(`Insurance ${insurance.id} not found in Binance`);
      return;
    }
    if (!binanceInsurance.binanceAccount) {
      this.logger.error(
        `Account ${binanceInsurance.binanceAccountId} not found`,
      );
      return;
    }

    const client = this.getClient(binanceInsurance.binanceAccount);

    if (binanceInsurance.closeOrderId) {
    }
  }
}
