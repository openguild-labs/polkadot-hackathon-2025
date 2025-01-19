import { PairConfig } from '@/@type/pair.type';
import { informula } from '@/lib/informula';
import { addDays, addHours } from 'date-fns';
// import dayjs from 'dayjs';
import { ENUM_INSURANCE_SIDE, PERIOD_UNIT, QUOTE_ASSET } from 'hakifi-formula';

export interface CalculateInsuranceParamsDto {
  period: number;
  margin: number;
  p_open: number;
  p_claim: number;
  periodUnit: string;
  periodChangeRatio: number;
  percision: number;
}

export function calculateInsuranceParams(data: CalculateInsuranceParamsDto) {
  const {
    period,
    margin,
    p_open,
    p_claim,
    periodUnit,
    periodChangeRatio,
    percision
  } = data;
  let expiredAt: Date = new Date();
  switch (periodUnit) {
    case PERIOD_UNIT.DAY:
      // expiredAt = dayjs().add(period, 'day').toDate();
      expiredAt = addDays(expiredAt, period);
      break;
    case PERIOD_UNIT.HOUR:
      // expiredAt = dayjs().add(period, 'hour').toDate();
      expiredAt = addHours(expiredAt, period);
      break;
  }

  const hedgeClaim = p_claim && p_open ? informula.calculateHedge(Math.abs(p_open - p_claim), p_open) : 0;
  const p_claim_gap = informula.calculatePclaimGap({
    p_claim, p_open, quote_asset: QUOTE_ASSET.USDT, price_precision: percision
  });
  console.log({p_claim, p_open, quote_asset: QUOTE_ASSET.USDT, price_precision: percision})
  const p_liquidation = informula.calculatePStop({
    p_claim: p_claim_gap,
    p_open,
  });
  const q_claim = informula.calculateQClaim({
    day_change_token: periodChangeRatio,
    margin,
    p_claim: p_claim_gap,
    p_open,
    // period_unit: periodUnit as PERIOD_UNIT,
  });

  const p_refund = informula.calculatePRefund(p_open, p_claim);
  const p_cancel = (p_claim + p_refund) / 2;

  return {
    expiredAt,
    hedgeClaim,
    q_claim,
    p_liquidation,
    p_refund,
    p_cancel,
  };
}

export interface GetDefaultPClaimParamsDto {
  min: number;
  max: number;
  side: ENUM_INSURANCE_SIDE;
  periodChangeRatio: number;
}

export function getDefaultPClaim(params: GetDefaultPClaimParamsDto) {
  const { max, min, periodChangeRatio, side } = params;
  const negative = side === ENUM_INSURANCE_SIDE.BEAR ? -1 : 1;
  const ratio = negative * 0.002;
  const avg = periodChangeRatio * ratio;
  const value = side === ENUM_INSURANCE_SIDE.BEAR ? max : min;
  return value + value * ratio;
}
