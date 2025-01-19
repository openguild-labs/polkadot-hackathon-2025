/**
 * SnakeAI - Advanced AI Engine for Web3 Games
 * @package snake-ai
 */

// Core exports
export { GameManager } from "./core/GameManager";
export { BaseAgent } from "./core/BaseAgent";
export { EventManager } from "./core/EventManager";

// AI exports
export { AIAgent } from "./ai/AIAgent";
export { DecisionModel } from "./ai/DecisionModel";
export { BaseAIModel } from "./ai/BaseAIModel";

// Blockchain exports
export { BlockchainAdapter } from "./blockchain/BlockchainAdapter";
export { EthereumAdapter } from "./blockchain/EthereumAdapter";

// Type exports
export * from "./types";
export * from "./types/ai";
export * from "./types/events";

// Configuration
export { config as defaultConfig } from "./config/env";

// SDK Class
export class SnakeAI {
  private gameManager: GameManager;

  constructor(options: {
    network: "ethereum" | "bsc" | "solana";
    rpcUrl: string;
    contractAddress: string;
    privateKey?: string;
    aiConfig?: any;
  }) {
    let blockchain: BlockchainAdapter;

    switch (options.network) {
      case "solana":
        blockchain = new SolanaAdapter({
          rpcUrl: options.rpcUrl,
          contractAddress: options.contractAddress,
          privateKey: options.privateKey,
          network: "solana",
          commitment: "confirmed",
        });
        break;
      case "bsc":
        blockchain = new BSCAdapter({
          rpcUrl: options.rpcUrl,
          contractAddress: options.contractAddress,
          privateKey: options.privateKey,
          network: "bsc",
        });
        break;
      default:
        blockchain = new EthereumAdapter({
          rpcUrl: options.rpcUrl,
          contractAddress: options.contractAddress,
          privateKey: options.privateKey,
          network: "ethereum",
        });
    }

    this.gameManager = new GameManager(blockchain);
  }

  async initialize(): Promise<void> {
    await this.gameManager.initialize();
  }

  createAIAgent(
    id: string,
    type: AgentType,
    initialState: AgentState,
    modelConfig: AIModelConfig
  ): AIAgent {
    const agent = new AIAgent(id, type, initialState, modelConfig);
    this.gameManager.registerAgent(agent);
    return agent;
  }

  getGameManager(): GameManager {
    return this.gameManager;
  }
}
