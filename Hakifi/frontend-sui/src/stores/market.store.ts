import { MarketPair } from "@/@type/pair.type";
import { GetPairsParams, getAllMarketPair } from "@/apis/pair.api";
import { Ticker } from "@/hooks/useTickerSocket";
import { handleRequest } from "@/utils/helper";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Store = {
	marketPairs: MarketPair[];
	getMarketParis: () => void;
	setMarketPairs: (marketPairs: MarketPair[]) => void;
	tickers: Record<string, Ticker>;
	setTicker: (ticker: Ticker) => void;
	tabs: "favorite" | "hot" | "policy";
	setTabs: (tabs: "favorite" | "hot" | "policy") => void;
};

const useMarketStore = create<Store>()(
	immer((set) => ({
		tickers: {},
		setTicker: (ticker: Ticker) => {
			set((state) => {
				state.tickers[ticker.symbol] = ticker;
			});
		},
		tabs: "favorite",
		marketPairs: [],
		setMarketPairs(marketPairs: MarketPair[]) {
			set((state) => {
				state.marketPairs = marketPairs;
			});
		},
		setTabs(tabs: "favorite" | "hot" | "policy") {
			set((state) => {
				state.tabs = tabs;
			});
		},
		getMarketParis: async () => {
			const [err, response] = await handleRequest(getAllMarketPair());
			if (err) {
				console.log(err);
				return;
			}

			set((state) => {
				state.marketPairs = response;
			});
		},
	}))
);

export default useMarketStore;
