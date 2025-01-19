export type TopContracts = {
  asset: string;
  unit: string;
  side: string;
  contracts: number;
  symbol: string;
  high: number;
  low: number;
  lastPrice: number;
  priceChangePercent: number;
};

export type TopCoverAmount = {
  asset: string;
  unit: string;
  side: string;
  q_covered: number;
  margin: number;
  symbol: string;
  high: number;
  low: number;
  lastPrice: number;
  priceChangePercent: number;
};

export type TopGainers = {
  asset: string;
  unit: string;
  side: string;
  q_claim: number;
  margin: number;
  symbol: string;
  high: number;
  low: number;
  lastPrice: number;
  priceChangePercent: number;
};

export type TopPaybackUsers = {
  walletAddress: string;
  totalPayback: number;
};

export type DataOverviewMarket = {
  topContracts: TopContracts[];
  topCoverAmount: TopCoverAmount[];
  topGainers: TopGainers[];
  topPaybackUsers: TopPaybackUsers[];
};

export type TableFavoriteHot = {
  id: string;
  symbol: string;
  category: string;
  asset: string;
  unit: string;
  isMaintain: boolean;
  isActive: boolean;
  isHot: boolean;
  createdAt: string;
  updatedAt: string;
  token: {
    attachment: string;
    id: string;
    decimals: number;
  };
  high: number;
  low: number;
  lastPrice: number;
  priceChangePercent: number;
  isFavorite: boolean;
  totalContactBull: number;
  totalContractBear: number;
  totalQCover: number;
  totalMargin: number;
};
