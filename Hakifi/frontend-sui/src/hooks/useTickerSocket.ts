'use client';

import { useCallback, useMemo } from 'react';
import useBinanceStreamSocket from './useBinanceStreamSocket';

/**
SAMPLE DATA
{
    "e": "24hrMiniTicker",
    "E": 1703243619861,
    "s": "BTCUSDT",
    "c": "43700.00",
    "o": "44150.70",
    "h": "44484.00",
    "l": "43386.20",
    "v": "311411.241",
    "q": "13661427120.22"
}
 */

export type MiniTickerData = {
  e: string;
  E: number;
  s: string;
  c: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
};

export const useMiniTickerSocket = (
  symbol: string | string[],
  callback: (data: MiniTickerData) => void,
) => {
  const streams = useMemo(() => {
    const symbols = Array.isArray(symbol) ? symbol : [symbol];
    return symbols.map((symbol) => `${symbol.toLowerCase()}@miniTicker`);
  }, [symbol]);

  return useBinanceStreamSocket(streams, callback);
};

/**
{
  "e": "24hrTicker",  // Event type
  "E": 123456789,     // Event time
  "s": "BTCUSDT",     // Symbol
  "p": "0.0015",      // Price change
  "P": "250.00",      // Price change percent
  "w": "0.0018",      // Weighted average price
  "c": "0.0025",      // Last price
  "Q": "10",          // Last quantity
  "o": "0.0010",      // Open price
  "h": "0.0025",      // High price
  "l": "0.0010",      // Low price
  "v": "10000",       // Total traded base asset volume
  "q": "18",          // Total traded quote asset volume
  "O": 0,             // Statistics open time
  "C": 86400000,      // Statistics close time
  "F": 0,             // First trade ID
  "L": 18150,         // Last trade Id
  "n": 18151          // Total number of trades
} 
*/

export type TickerData = {
  e: string;
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  c: string; // Last price
  Q: string; // Last quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade Id
  n: number; // Total number of trades
};

export type Ticker = {
  event: string;
  eventTime: number;
  symbol: string;
  priceChange: number;
  priceChangePercent: number;
  weightedAveragePrice: number;
  lastPrice: number;
  lastQuantity: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  baseAssetVolume: number;
  quoteAssetVolume: number;
  statisticsOpenTime: number;
  statisticsCloseTime: number;
  firstTradeId: number;
  lastTradeId: number;
  totalNumberOfTrades: number;
};

export const useTickerSocket = (
  symbol: string | string[],
  callback: (data: Ticker) => void,
) => {
  const streams = useMemo(() => {
    const symbols = Array.isArray(symbol) ? symbol : [symbol];
    return symbols.map((symbol) => `${symbol.toLowerCase()}@ticker`);
  }, [symbol]);

  const cb = useCallback(
    (data: TickerData) => {
      callback({
        event: data.e,
        eventTime: data.E,
        symbol: data.s,
        priceChange: parseFloat(data.p),
        priceChangePercent: parseFloat(data.P),
        weightedAveragePrice: parseFloat(data.w),
        lastPrice: parseFloat(data.c),
        lastQuantity: parseFloat(data.Q),
        openPrice: parseFloat(data.o),
        highPrice: parseFloat(data.h),
        lowPrice: parseFloat(data.l),
        baseAssetVolume: parseFloat(data.v),
        quoteAssetVolume: parseFloat(data.q),
        statisticsOpenTime: data.O,
        statisticsCloseTime: data.C,
        firstTradeId: data.F,
        lastTradeId: data.L,
        totalNumberOfTrades: data.n,
      });
    },
    [callback],
  );

  return useBinanceStreamSocket(streams, cb);
};
