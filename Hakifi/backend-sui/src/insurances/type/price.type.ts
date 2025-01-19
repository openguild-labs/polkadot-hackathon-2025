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
};
