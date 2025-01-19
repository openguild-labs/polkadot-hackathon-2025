import request from "./request/instance";
import { Pair, PairDetail, MarketPair,TCategory } from "@/@type/pair.type";

export const getPairDetail = (symbol: string) => {
	return request.get<PairDetail>(`/pairs/${symbol}`);
};

export type GetPairsParams = {
	q?: string;
	page?: number;
	includePrice?: boolean;
	sort?: string;
};

export const getPairsApi = (params: GetPairsParams) => {
	return request.get<{ rows: Pair[]; total: number }>(`/pairs`, { params });
};

export const getPairFavorites = (params: GetPairsParams) => {
	return request.get<{ rows: Pair[]; total: number }>(`/pairs/favorites`, {
		params,
	});
};

export const addPairFavorites = async (symbol: string) => {
	return await request.post(`/pairs/favorites/${symbol}`);
};

export const deletePairFavorites = async (symbol: string) => {
	return await request.delete(`/pairs/favorites/${symbol}`);
};

export const addAllFavorites = async (listSymbol: string[]) => {
	return await request.post(`/pairs/favorites`, {
		symbols: listSymbol,
	});
};

export const getAllFavoritesSymbol = async () => {
	return await request.get<string[]>(`/pairs/favorites/all-symbols`);
};

export const getAllMarketPair = async () => {
	return await request.get<MarketPair[]>(`/pairs/market-pairs`);
};

export const getAllCategory = async () => {
	return await request.get<TCategory[]>(
		"/tokens/tags"
	);
};
