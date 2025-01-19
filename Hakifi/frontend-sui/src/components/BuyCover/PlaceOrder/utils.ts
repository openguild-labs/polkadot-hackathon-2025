import { informula } from '@/lib/informula';
import { addDays, addHours } from 'date-fns';
// import dayjs from 'dayjs';
import { ENUM_INSURANCE_SIDE, PERIOD_UNIT } from 'hakifi-formula';

export interface CalculateInsuranceParamsDto {
  period: number;
  margin: number;
  q_covered: number;
  p_open: number;
  p_claim: number;
  periodUnit: string;
  periodChangeRatio: number;
}

export function calculateInsuranceParams(data: CalculateInsuranceParamsDto) {
  const {
    period,
    margin,
    q_covered,
    p_open,
    p_claim,
    periodUnit,
    periodChangeRatio,
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

  const hedge =
    margin && q_covered ? informula.calculateHedge(margin, q_covered) : 0;

  const hedgeClaim = p_claim && p_open ? informula.calculateHedge(Math.abs(p_open - p_claim), p_open) : 0;

  const p_liquidation = informula.calculatePStop({
    hedge,
    p_claim,
    p_open,
  });
  const q_claim = informula.calculateQClaim({
    hedge,
    day_change_token: periodChangeRatio,
    margin,
    p_claim,
    p_open,
    period_unit: periodUnit as PERIOD_UNIT,
  });

  const p_refund = informula.calculatePRefund(p_open, p_claim);
  const p_cancel = (p_claim + p_refund) / 2;

  return {
    expiredAt,
    hedgeClaim,
    hedge,
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
  const ratio = negative * 0.02;
  const avg = periodChangeRatio * ratio;
  const value = side === ENUM_INSURANCE_SIDE.BEAR ? max : min;
  return value + value * avg;
}
