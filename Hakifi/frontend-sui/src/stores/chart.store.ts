import { produce } from 'immer';
import { TradingAPIOption } from 'nami-trading-price-service';
import { create } from 'zustand';

type Store = {
  chartConfig: TradingAPIOption;
  setChartConfig: (config: TradingAPIOption) => void;
};

const useChartStore = create<Store>()((set) => ({
  chartConfig: {
    exchange: 'BINANCE',
    base_api_url: 'https://fapi.binance.com',
    stream_host: 'fstream.binance.com',
    symbol_info_url: 'https://datav2.nami.exchange/api/v1/chart/symbol_info',
  },

  setChartConfig(config) {
    set(
      produce((state) => {
        state.chartConfig = config;
      }),
    );
  },
}));

export default useChartStore;
