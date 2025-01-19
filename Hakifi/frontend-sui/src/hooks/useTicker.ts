
import useMarketStore from '@/stores/market.store';
import { Ticker, useTickerSocket } from './useTickerSocket';

const useTicker = (symbol: string): Ticker | null => {
  const [ticker, setTicker] = useMarketStore((state) => [
    state.tickers[symbol] || null,
    state.setTicker,
  ]);

  useTickerSocket(symbol, setTicker);
  return ticker;
};

export default useTicker;
