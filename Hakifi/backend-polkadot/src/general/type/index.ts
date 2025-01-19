import { BaseUnit, InsuranceSide } from '@prisma/client';

export type MarketOverviewResults = {
  topContracts: {
    asset: string;
    unit: BaseUnit;
    side: InsuranceSide;
    contracts: number;
    symbol: string;
  }[];
  topCoverAmount: {
    asset: string;
    unit: BaseUnit;
    side: InsuranceSide;
    margin: number;
    q_covered: number;
    symbol: string;
  }[];
  topGainers: {
    asset: string;
    unit: BaseUnit;
    side: InsuranceSide;
    margin: number;
    q_claim: number;
    symbol: string;
  }[];
  topPaybackUsers: {
    walletAddress: string;
    totalPayback: number;
  }[];
  symbols: string[];
};
