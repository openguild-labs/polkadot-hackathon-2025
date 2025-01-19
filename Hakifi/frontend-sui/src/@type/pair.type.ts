import { ENUM_SYMBOL_PREDICTION } from "hakifi-formula";

// export type Pair = {
//   id: string;
//   symbol: string;
//   category: string;
//   asset: string;
//   unit: string;
//   isMaintain: boolean;
//   isActive: boolean;
//   isHot: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   token: {
//     attachment: string;
//     id: string;
//     decimals: number;
//   };
//   high: number;
//   low: number;
//   lastPrice: number;
//   priceChangePercent: number;
//   isFavorite: boolean;
//   totalContactBull: number;
//   totalContractBear: number;
//   totalQCover: number;
//   totalMargin: number;
// };

export type PairConfig = {
	listDayChangeRatio: number[];
	listHourChangeRatio: [];
	listChangeRatios: PeriodRatio[];
};

// export type PairDetail = Pair & {
//   config: PairConfig;
//   lastPrice: number;
//   priceChangePercent: number;
// };

export type Pair = {
	id: string;
	symbol: string;
	asset: string;
	unit: string;
	isMaintain: boolean;
	isActive: boolean;
	isHot: boolean;
	createdAt: Date;
	updatedAt: Date;
	token: {
		attachment: string;
		id: string;
		decimals: number;
		tagIds: number[]
	};
	lastPrice?: number;
	priceChangePercent?: number;
	high?: number;
	low?: number;
	signal: ENUM_SYMBOL_PREDICTION;
};

export type PeriodRatio = {
	period: number;
	periodUnit: string;
	periodChangeRatio: number;
};

export type PairDetail = Pair & {
	config: PairConfig;
	lastPrice: number;
	priceChangePercent: number;
};

export type MarketPair = {
	id: string;
	symbol: string;
	asset: string;
	unit: string;
	isMaintain: boolean;
	isActive: boolean;
	isHot: boolean;
	createdAt: Date;
	updatedAt: Date;
	token: {
		attachment: string;
		decimals: number;
		tagIds: number[]
	};
	totalBear: number;
	totalBull: number;
	totalContract: number;
	margin: number;
	q_covered: number;
	refunded: number;
	claimed: number;
	payback: number;
	high: number;
	low: number;
	lastPrice: number;
	priceChangePercent: number;
	category: string;
};

export type Period = "days" | "hours";

export type PeriodChangeRatio = {
	period: number;
	periodUnit: Period;
	periodChangeRatio: number;
};

export type TCategory = { id: number; name: string; description: string }