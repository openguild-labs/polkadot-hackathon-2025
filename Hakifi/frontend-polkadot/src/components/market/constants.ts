import { MarketPair } from "@/@type/pair.type";

export const FIELDS = {
	MARGIN: "margin",
	P_CLAIM: "p_claim",
};

export const TYPE_CARD_MARKET = {
	CONTRACT: "contract",
	AMOUNT: "amount",
	USER: "user",
};

type TSort = {
	value: keyof MarketPair | "totalBullBear";
	label: string;
};

export const TAB_TABLE_MARKET = {
	FAVORITE: "favorite",
	HOT: "hot",
	POLICY: "policy",
};

export const DATA_SORT_FAVORITE: TSort[] = [
	{
		label: "Pair",
		value: "asset"
	},
	{
		label: "Market Price",
		value: "lastPrice",
	},
	{
		label: "24h Change",
		value: "priceChangePercent",
	},
	{
		label: "24h High",
		value: "high",
	},
	{
		label: "24h Low",
		value: "low",
	},
	{
		label: "Total Q-Cover",
		value: "q_covered",
	},
	{
		label: "Total Margin",
		value: "margin",
	},
];

export const DATA_SORT_HOT: TSort[] = [
	{
		label: "Pair",
		value: "asset"
	},
	{
		label: "Market Price",
		value: "lastPrice",
	},
	{
		label: "24h Change",
		value: "priceChangePercent",
	},
	{
		label: "24h High",
		value: "high",
	},
	{
		label: "24h Low",
		value: "low",
	},
	{
		label: "Total Contracts Bull/Bear",
		value: "totalBullBear",
	},
	{
		label: "Total Q-Cover",
		value: "q_covered",
	},
	{
		label: "Total Margin",
		value: "margin",
	},
];

export const DATA_SORT_POLICY = [
	{
		label: "Pair",
		value: "asset",
	},
	{
		label: "Min/Max Q-Cover",
		value: "lastPrice",
	},
	{
		label: "Min/Max Margin Rate",
		value: "priceChangePercent",
	},
	{
		label: "Min/Max Price Gap Ratio",
		value: "high",
	},
	{
		label: "Min/Max Period",
		value: "low",
	},
	{
		label: "Total Margin Open/Limit",
		value: "totalBullBear",
	},
];
