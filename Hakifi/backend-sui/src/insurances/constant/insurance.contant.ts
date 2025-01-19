export const INVALID_REASONS = {
  INVALID_MARGIN: 'INVALID_MARGIN',
  INVALID_WALLET_ADDRESS: 'INVALID_WALLET_ADDRESS',
  CREATED_TIME_TIMEOUT: 'CREATED_TIME_TIMEOUT',
  INVALID_UNIT: 'INVALID_UNIT',
  INVALID_PRICE: 'INVALID_PRICE',
};

export enum UnitContract {
  USDT = 0,
  VNST = 1,
}

export enum InsuranceContractState {
  PENDING = 'pending',
  AVAILABLE = 'available',
  CLAIMED = 'claimed',
  REFUNDED = 'refunded',
  LIQUIDATED = 'liquidated',
  EXPIRED = 'expired',
  CANCELLED = 'canceled',
  INVALID = 'invalid',
}

export enum IsuranceContractType {
  CREATE = 8,
  UPDATE_AVAILABLE= 9,
  UPDATE_INVALID = 10,
  REFUND = 11,
  CANCEL = 12,
  CLAIM = 13,
  EXPIRED = 14,
  LIQUIDATED = 15
}


export const RATIO_DIFF_VALID_PRICE = 0.003;

export const MIN_AMOUNT_TRANSFER_BINANCE = 5;
