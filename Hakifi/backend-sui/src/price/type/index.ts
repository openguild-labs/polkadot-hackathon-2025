import { Ticker } from 'binance-api-node';

export type CheckPrice = {
  p: number;
  t: number;
};

export type SymbolStreamPrice = {
  closeStream: Function;
  symbol: string;
  checkPrices: CheckPrice[];
  lastPrice: number;
  updateTime: number;
  priceChangePercent: number;
  high: number;
  low: number;
};
