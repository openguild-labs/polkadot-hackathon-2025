import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { PrismaService } from 'nestjs-prisma';
import { ERROR_INSURANCE } from './constant/errors.constant';
import { ENUM_SYMBOL_PREDICTION, InsuranceFormula } from 'hakifi-formula';
import { InsuranceHelper } from './insurance.helper';
import {
  Insurance,
  InsurancePeriodUnit,
  InsuranceSide,
  InsuranceState,
  Prisma,
} from '@prisma/client';
import { InsuranceContractService } from './insurance-contract.service';
import { ListInsuranceQueryDto } from './dto/query-insurance.dto';
import { inRange } from 'src/common/helpers/utils';
import { PriceService } from 'src/price/price.service';
import { PairsService } from '../pairs/pairs.service';
import { isMongoId } from 'class-validator';
import dayjs from 'dayjs';
import { MIN_AMOUNT_TRANSFER_BINANCE } from './constant/insurance.contant';

@Injectable()
export class InsurancesService {
  formula: InsuranceFormula;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly insuranceHelper: InsuranceHelper,
    private readonly insuranceContractService: InsuranceContractService,
    private readonly priceService: PriceService,
    private readonly pairService: PairsService,
  ) {
    this.formula = new InsuranceFormula();
  }

  /**
   * Creates a new insurance for a user.
   * @param userId - The ID of the user.
   * @param createInsuranceDto - The data for creating the insurance.
   * @returns The created insurance.
   * @throws BadRequestException if the symbol is invalid, the pair is not active, or the pair is under maintenance.
   * @throws BadRequestException if there is an error retrieving the current price.
   * @throws BadRequestException if the period unit is invalid.
   */
  async create(userId: string, createInsuranceDto: CreateInsuranceDto) {
    const {
      asset,
      unit,
      period,
      periodUnit,
      p_claim,
      margin,
      q_cover_pack_id,
    } = createInsuranceDto;
    const symbol = `${asset}${unit}`;
    const pair = await this.prismaService.pair.findUnique({
      where: { symbol },
      select: {
        symbol: true,
        asset: true,
        unit: true,
        isActive: true,
        isMaintain: true,
        pricePrecision: true,
        config: {
          select: {
            listDayChangeRatio: true,
            listHourChangeRatio: true,
          },
        },
      },
    });
    const qCoverPack = await this.prismaService.qCoverPack.findUnique({
      where: {
        id: q_cover_pack_id,
      },
    });

    if (!qCoverPack) {
      throw new BadRequestException(ERROR_INSURANCE.INVALID_Q_COVER_PACK);
    }

    if (!pair || !pair.isActive || !pair.config) {
      throw new BadRequestException(ERROR_INSURANCE.BAD_SYMBOL);
    }

    if (pair.isMaintain) {
      throw new BadRequestException(ERROR_INSURANCE.MAINTAINED);
    }
    const { q_cover_default, max_margin, min_margin } = qCoverPack;
    let currentPrice = 0;
    try {
      currentPrice = await this.priceService.getFuturePrice(symbol);
    } catch (error) {
      throw new BadRequestException(ERROR_INSURANCE.BAD_SYMBOL);
    }
    // set p_open with current price when create insurance
    createInsuranceDto.p_open = currentPrice;

    const list_ratio_change = await this.pairService.getConfigPeriod(pair);

    let date, chartInterval;
    const current = dayjs.utc();
    if (periodUnit === InsurancePeriodUnit.HOUR) {
      switch (Number(period)) {
        case 1:
          chartInterval = '1h';
          date = current.startOf('h').valueOf();
          break;
        case 4:
          chartInterval = '4h';

          date = current
            .hour([0, 4, 8, 12, 16, 20][Math.floor(current.hour() / 4)])
            .minute(0)
            .second(0)
            .millisecond(0)
            .valueOf();
          break;
        case 12:
          chartInterval = '12h';

          date = current
            .hour([0, 12][Math.floor(current.hour() / 12)])
            .minute(0)
            .second(0)
            .millisecond(0)
            .valueOf();
          break;
        default:
          break;
      }
    } else {
      chartInterval = '1d';
      date = current.startOf('d').valueOf();
    }

    const signal = await this.prismaService.symbolPrediction.findUnique({
      where: {
        symbol_chartInterval_date: {
          symbol: symbol.toUpperCase(),
          date,
          chartInterval,
        },
      },
    });

    const side =
      p_claim > currentPrice ? InsuranceSide.BULL : InsuranceSide.BEAR;

    const availablePeriod = list_ratio_change.find((item) => {
      return item.periodUnit === periodUnit && item.period === period;
    });
    const periodChangeRatio = availablePeriod?.periodChangeRatio;

    if (periodChangeRatio === undefined) {
      throw new BadRequestException(ERROR_INSURANCE.INVALID_PERIOD);
    }

    createInsuranceDto.periodChangeRatio = periodChangeRatio;
    createInsuranceDto.side = side;

    const pricePrecision = pair.pricePrecision;

    // Calculate Insurance params
    const {
      expiredAt,
      p_liquidation,
      q_claim,
      systemCapital,
      p_refund,
      leverage,
      p_cancel,
      p_claim_gap,
    } = this.insuranceHelper.calculateInsuranceParams({
      ...createInsuranceDto,
      pricePrecision,
    });

    let invalidReason: string;

    // Throw when invalid insurance
    await this.insuranceHelper.validateInsurance(
      createInsuranceDto,
      list_ratio_change,
      signal?.signal === ENUM_SYMBOL_PREDICTION.BUY
        ? ENUM_SYMBOL_PREDICTION.BUY
        : ENUM_SYMBOL_PREDICTION.SELL,
      min_margin,
      max_margin,
    );

    // Create Insurance
    const insurance = await this.prismaService.insurance.create({
      data: {
        userId,
        asset,
        unit,
        margin,
        q_claim,
        q_covered: q_cover_default,
        q_cover_pack_id,
        p_open: currentPrice,
        p_liquidation,
        p_claim,
        p_refund,
        p_cancel,
        leverage,
        periodChangeRatio,
        systemCapital,
        invalidReason,
        period,
        periodUnit,
        state: InsuranceState.PENDING,
        //Todo: add more conditions to check can transfer to binance
        canTransferBinance: margin >= MIN_AMOUNT_TRANSFER_BINANCE,
        side,
        expiredAt,
        stateLogs: [],
        metadata: { p_claim_gap },
      },
    });

    // this.insuranceContractService.createSampleInsurance({
    //   id: insurance.id,
    //   margin: insurance.margin,
    //   q_claim: insurance.q_claim,
    //   expiredAt: insurance.expiredAt,
    // });

    return insurance;
  }

  async findAll(query: ListInsuranceQueryDto) {
    const where: Prisma.InsuranceWhereInput = {
      userId: query.userId,
    };

    if (query.state) {
      where.state = query.state;
    }

    if (query.isClosed) {
      where.closedAt = { not: null };
    }

    if (query.q) {
      where.OR = [{ txhash: { contains: query.q, mode: 'insensitive' } }];

      if (isMongoId(query.q)) {
        where.OR.push({ id: query.q });
      }
    }

    if (query.closedFrom || query.closedTo) {
      where.closedAt = {};
      if (query.closedFrom) where.closedAt.gte = query.closedFrom;
      if (query.closedTo) where.closedAt.lte = query.closedTo;
    }

    if (query.createdFrom || query.createdTo) {
      where.createdAt = {};
      if (query.createdFrom) where.createdAt.gte = query.createdFrom;
      if (query.createdTo) where.createdAt.lte = query.createdTo;
    }

    if (query.expiredFrom || query.expiredTo) {
      where.expiredAt = {};
      if (query.expiredFrom) where.expiredAt.gte = query.expiredFrom;
      if (query.expiredTo) where.expiredAt.lte = query.expiredTo;
    }

    if (query.asset) {
      where.asset = query.asset.toUpperCase();
    }

    const [total, rows] = await Promise.all([
      this.prismaService.insurance.count({ where }),
      this.prismaService.insurance.findMany({
        skip: query.skip,
        take: query.limit,
        where,
        orderBy: query.orderBy,
        include: {
          token: {
            select: {
              name: true,
              attachment: true,
            },
          },
        },
      }),
    ]);

    return { total, rows };
  }

  async deletePendingInsurance(userId: string, id: string) {
    await this.prismaService.insurance.delete({
      where: { id, state: InsuranceState.PENDING, userId },
    });
    return {
      success: true,
    };
  }

  /**
   * Cancels an insurance for a specific user.
   *
   * @param userId - The ID of the user.
   * @param id - The ID of the insurance.
   * @returns The cancelled insurance.
   * @throws BadRequestException if the insurance is not found, or if it is not in the correct state to be cancelled.
   * @throws BadRequestException if the current price is invalid for cancellation.
   * @throws InternalServerErrorException if an error occurs while cancelling the insurance.
   */
  async cancelInsurance(userId: string, id: string) {
    const insurance = await this.prismaService.insurance.findUnique({
      where: { id, userId },
    });
    if (!insurance) {
      throw new BadRequestException('Insurance not found');
    }

    const isLocked = await this.insuranceHelper.isInsuranceLocked(id);

    if (insurance.state !== InsuranceState.AVAILABLE || isLocked) {
      throw new BadRequestException(ERROR_INSURANCE.ERROR_CANCEL);
    }

    const symbol = `${insurance.asset}${insurance.unit}`;
    const currentPrice = await this.priceService.getFuturePrice(symbol);

    if (!currentPrice) {
      throw new BadRequestException(ERROR_INSURANCE.INVALID_CANCLE_PRICE);
    }

    const canCancel = inRange(
      currentPrice,
      insurance.p_cancel,
      insurance.p_claim,
    );

    if (!canCancel) {
      throw new BadRequestException(ERROR_INSURANCE.INVALID_CANCLE_PRICE);
    }
    try {
      const updatedInsurance =
        await this.insuranceContractService.cancelInsurance(
          insurance,
          currentPrice,
        );
      return updatedInsurance;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: string, userId: string) {
    return this.prismaService.insurance.findUnique({
      where: { id, userId },
    });
  }

  getInsuranceContract(id: string) {
    return this.insuranceContractService.getInsuranceContract(id);
  }

  async updateTxHash(userId: string, id: string, txhash: string) {
    const insurance = await this.prismaService.insurance.findUnique({
      where: { id, userId },
    });
    if (insurance.state !== InsuranceState.PENDING) {
      throw new BadRequestException('Insurance state not pending');
    }

    return this.prismaService.insurance.update({
      where: { id, userId },
      data: { txhash },
    });
  }

  async getAllQCoverPacks() {
    return this.prismaService.qCoverPack.findMany({
      orderBy: {
        id: Prisma.SortOrder.asc,
      },
    });
  }
}
