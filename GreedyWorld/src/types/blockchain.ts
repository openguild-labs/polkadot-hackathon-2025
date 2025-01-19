export interface NetworkConfig {
  rpcUrl: string;
  contractAddress: string;
  defaultAccount?: string;
  privateKey?: string;
  chainId?: number;
  network?: "ethereum" | "bsc" | "solana";
  commitment?: "processed" | "confirmed" | "finalized"; // Solana specific
}

export interface TransactionConfig {
  from?: string;
  value?: string;
  gasLimit?: number;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  // Solana specific
  skipPreflight?: boolean;
  preflightCommitment?: "processed" | "confirmed" | "finalized";
}

export type ContractMethod =
  | "movePlayer"
  | "attackTarget"
  | "executeTrade"
  | "craftItem"
  | string;

export interface BlockchainEvent {
  type: string;
  data: any;
  blockNumber: number;
  transactionHash: string;
}
