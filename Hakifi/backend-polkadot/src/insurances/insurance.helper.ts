import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CalculateFutureQuantity,
  CalculateInsuranceParamsDto,
  CreateInsuranceDto,
} from './dto/create-insurance.dto';

import { ERROR_INSURANCE } from './constant/errors.constant';
import {
  ENUM_INSURANCE_SIDE,
  ENUM_SYMBOL_PREDICTION,
  InsuranceFormula,
  QUOTE_ASSET,
  TListRatioChange,
} from 'hakifi-formula';
import { InsurancePeriodUnit } from '@prisma/client';
import dayjs from 'dayjs';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class InsuranceHelper {
  formula: InsuranceFormula;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.formula = new InsuranceFormula();
  }

  /**
   * Validates the insurance data.
   * @param data - The insurance data to be validated.
   * @param list_ratio_change - The list of change ratios.
   * @param signal - ENUM_SYMBOL_PREDICTION - BUY or SELL.
   * @returns True if the insurance data is valid, otherwise throws an exception.
   */
  async validateInsurance(
    data: CreateInsuranceDto,
    list_ratio_change: TListRatioChange[],
    signal: ENUM_SYMBOL_PREDICTION,
    min_margin: number,
    max_margin: number,
  ) {
    const { margin, p_open, p_claim, periodChangeRatio, side } = data;
    if (margin < min_margin || margin > max_margin) {
      throw new BadRequestException(ERROR_INSURANCE.INVALID_MARGIN);
    }

    const { claim_price_max, claim_price_min } = this.formula.getDistancePClaim(
      {
        period_change_ratio: periodChangeRatio,
        p_market: p_open,
        list_ratio_change: list_ratio_change,
        side: side as ENUM_INSURANCE_SIDE,
        signal: signal,
      },
    );

    if (p_claim < claim_price_min || p_claim > claim_price_max) {
      throw new BadRequestException(ERROR_INSURANCE.INVALID_P_CLAIM);
    }

    return true;
  }

  /**
   * Calculates the insurance parameters based on the provided data.
   * @param data - The data used to calculate the insurance parameters.
   * @returns An object containing the calculated insurance parameters.
   */
  calculateInsuranceParams(data: CalculateInsuranceParamsDto) {
    const {
      period,
      margin,
      pricePrecision,
      p_open,
      p_claim,
      periodUnit,
      periodChangeRatio,
    } = data;
    let expiredAt: Date;
    switch (periodUnit) {
      case InsurancePeriodUnit.DAY:
        expiredAt = dayjs().add(period, 'day').toDate();
        break;
      case InsurancePeriodUnit.HOUR:
        expiredAt = dayjs().add(period, 'hour').toDate();
        break;
    }

    const p_claim_gap = this.formula.calculatePclaimGap({
      p_claim,
      p_open,
      quote_asset: QUOTE_ASSET.USDT,
      price_precision: pricePrecision,
    });

    const p_liquidation = this.formula.calculatePStop({
      p_claim: p_claim_gap,
      p_open,
    });

    const ratioProfit = this.formula.calculateRatioPredict({
      p_claim,
      p_open,
    });

    const q_claim = this.formula.calculateQClaim({
      day_change_token: periodChangeRatio,
      margin,
      p_claim: p_claim_gap,
      p_open,
    });

    const systemCapital = this.formula.calculateSystemCapital({
      day_change_token: periodChangeRatio,
      margin,
      ratio_profit: ratioProfit,
    });

    const p_refund = this.formula.calculatePRefund(p_open, p_claim);
    const leverage = this.formula.calculateLeverage(ratioProfit);
    const p_cancel = (p_claim + p_refund) / 2;

    return {
      expiredAt,
      q_claim,
      systemCapital,
      p_liquidation,
      p_refund,
      leverage,
      p_cancel,
      p_claim_gap,
    };
  }

  calculateFutureQuantity(data: CalculateFutureQuantity): number {
    const { p_open, p_claim, margin, periodChangeRatio } = data;
    const ratio_profit = this.formula.calculateRatioPredict({
      p_claim: p_claim,
      p_open,
    });

    const leverage = this.formula.calculateLeverage(ratio_profit);
    const user_capital = margin;
    const system_capital = this.formula.calculateSystemCapital({
      day_change_token: periodChangeRatio,
      margin,
      ratio_profit,
    });
    const hedge_capital = user_capital + system_capital;
    const qty = (hedge_capital * leverage) / p_open;

    return qty;
  }

  private getLockKey(id: string) {
    return `insurance-lock:${id}`;
  }

  async lockInsurance(id: string, callback: () => Promise<void>) {
    const isLocked = await this.isInsuranceLocked(id);
    if (isLocked) {
      return;
    }

    const lockKey = this.getLockKey(id);
    await this.cacheManager.set(lockKey, true, 3 * 60 * 1000);
    try {
      await callback();
    } catch (error) {
      throw error;
    } finally {
      await this.cacheManager.del(lockKey);
    }
  }

  async isInsuranceLocked(id: string) {
    const lockKey = this.getLockKey(id);
    const isLock = await this.cacheManager.get(lockKey);
    return isLock === true;
  }
}
