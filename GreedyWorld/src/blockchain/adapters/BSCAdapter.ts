import { NetworkConfig } from "../../types";
import { EthereumAdapter } from "../EthereumAdapter";

export class BSCAdapter extends EthereumAdapter {
  constructor(networkConfig: NetworkConfig) {
    super({
      ...networkConfig,
      rpcUrl: networkConfig.rpcUrl || "https://bsc-dataseed.binance.org",
    });
  }

  // BSC specific optimizations and configurations
  protected async getOptimalGasPrice(): Promise<string> {
    const gasPrice = await super.getOptimalGasPrice();
    // BSC typically requires higher gas price
    return ((BigInt(gasPrice) * BigInt(12)) / BigInt(10)).toString();
  }
}
