import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import {
  IBlockchainAdapter,
  GameState,
  Action,
  BlockchainEvent,
  TransactionConfig,
  NetworkConfig,
} from "../types";

export abstract class BlockchainAdapter implements IBlockchainAdapter {
  protected web3: Web3;
  protected contract: Contract;
  protected networkConfig: NetworkConfig;
  protected gasPrice: string = "0";
  protected lastBlock: number = 0;

  constructor(networkConfig: NetworkConfig) {
    this.networkConfig = networkConfig;
    this.web3 = new Web3(networkConfig.rpcUrl);
  }

  abstract connect(): Promise<boolean>;
  abstract getGameState(): Promise<GameState>;
  abstract executeTransaction(
    action: Action,
    config?: TransactionConfig
  ): Promise<boolean>;
  abstract subscribeToEvents(callback: (event: BlockchainEvent) => void): void;

  // Common methods
  protected async estimateGas(
    method: string,
    params: any[],
    from: string
  ): Promise<number> {
    try {
      const gas = await this.contract.methods[method](...params).estimateGas({
        from,
      });
      return Math.ceil(gas * 1.1); // Add 10% buffer
    } catch (error) {
      console.error(`Gas estimation failed for ${method}:`, error);
      throw error;
    }
  }

  protected async getOptimalGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.web3.eth.getGasPrice();
      return this.web3.utils.toBN(gasPrice).toString();
    } catch (error) {
      console.error("Failed to get gas price:", error);
      return this.gasPrice;
    }
  }

  protected async waitForTransaction(txHash: string): Promise<boolean> {
    try {
      const receipt = await this.web3.eth.getTransactionReceipt(txHash);
      return receipt.status;
    } catch (error) {
      console.error("Transaction failed:", error);
      return false;
    }
  }

  public async getBalance(address: string): Promise<string> {
    return await this.web3.eth.getBalance(address);
  }

  public async getNonce(address: string): Promise<number> {
    return await this.web3.eth.getTransactionCount(address);
  }

  public isConnected(): boolean {
    return this.web3.eth.net.isListening();
  }

  public getNetworkId(): Promise<number> {
    return this.web3.eth.net.getId();
  }

  public getBlockNumber(): Promise<number> {
    return this.web3.eth.getBlockNumber();
  }
}
