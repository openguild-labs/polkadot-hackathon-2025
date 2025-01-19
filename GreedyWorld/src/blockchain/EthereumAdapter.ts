import { Contract } from "web3-eth-contract";
import {
  GameState,
  Action,
  BlockchainEvent,
  TransactionConfig,
  NetworkConfig,
  ContractMethod,
} from "../types";
import { BlockchainAdapter } from "./BlockchainAdapter";
import { gameABI } from "../contracts/GameABI";
import { retry } from "../utils/retry";
import { EventEmitter } from "events";

export class EthereumAdapter extends BlockchainAdapter {
  private eventEmitter: EventEmitter;
  private eventSubscriptions: Map<string, any>;
  private pendingTransactions: Set<string>;

  constructor(networkConfig: NetworkConfig) {
    super(networkConfig);
    this.eventEmitter = new EventEmitter();
    this.eventSubscriptions = new Map();
    this.pendingTransactions = new Set();
  }

  async connect(): Promise<boolean> {
    try {
      this.contract = new this.web3.eth.Contract(
        gameABI,
        this.networkConfig.contractAddress
      );

      await this.setupEventListeners();
      this.lastBlock = await this.getBlockNumber();
      this.gasPrice = await this.getOptimalGasPrice();

      return true;
    } catch (error) {
      console.error("Failed to connect to Ethereum:", error);
      return false;
    }
  }

  async getGameState(): Promise<GameState> {
    return retry(async () => {
      const [timestamp, players, resources, marketPrices, territories] =
        await Promise.all([
          this.web3.eth.getBlock("latest").then((block) => block.timestamp),
          this.contract.methods.getPlayers().call(),
          this.contract.methods.getResources().call(),
          this.contract.methods.getMarketPrices().call(),
          this.contract.methods.getTerritories().call(),
        ]);

      return {
        timestamp,
        players: this.parsePlayersData(players),
        resources: this.parseResourcesData(resources),
        marketPrices: this.parseMarketData(marketPrices),
        territories: this.parseTerritoryData(territories),
      };
    }, 3);
  }

  async executeTransaction(
    action: Action,
    config?: TransactionConfig
  ): Promise<boolean> {
    try {
      const method = this.getContractMethod(action);
      const params = this.getMethodParams(action);
      const from = config?.from || this.networkConfig.defaultAccount;

      const gas = await this.estimateGas(method, params, from);
      const gasPrice = await this.getOptimalGasPrice();
      const nonce = await this.getNonce(from);

      const tx = {
        from,
        to: this.contract.options.address,
        gas,
        gasPrice,
        nonce,
        data: this.contract.methods[method](...params).encodeABI(),
        ...config,
      };

      const signedTx = await this.web3.eth.accounts.signTransaction(
        tx,
        this.networkConfig.privateKey
      );

      const txHash = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      this.pendingTransactions.add(txHash);
      return await this.waitForTransaction(txHash);
    } catch (error) {
      console.error("Transaction execution failed:", error);
      return false;
    }
  }

  subscribeToEvents(callback: (event: BlockchainEvent) => void): void {
    this.eventEmitter.on("blockchain_event", callback);
  }

  private async setupEventListeners(): Promise<void> {
    // Listen to all contract events
    const events = this.contract.events.allEvents({
      fromBlock: "latest",
    });

    events.on("data", (event: any) => {
      const blockchainEvent: BlockchainEvent = {
        type: event.event,
        data: event.returnValues,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      };

      this.eventEmitter.emit("blockchain_event", blockchainEvent);
    });

    // Listen to new blocks
    this.web3.eth.subscribe("newBlockHeaders", async (error, block) => {
      if (error) {
        console.error("New block subscription error:", error);
        return;
      }

      this.lastBlock = block.number;
      this.gasPrice = await this.getOptimalGasPrice();
    });
  }

  private getContractMethod(action: Action): ContractMethod {
    const methodMap: Record<string, ContractMethod> = {
      MOVE: "movePlayer",
      ATTACK: "attackTarget",
      TRADE: "executeTrade",
      CRAFT: "craftItem",
      // ... other action mappings
    };

    return methodMap[action.type];
  }

  private getMethodParams(action: Action): any[] {
    switch (action.type) {
      case "MOVE":
        return [action.payload.x, action.payload.y];
      case "ATTACK":
        return [action.payload.targetId, action.payload.weaponId];
      case "TRADE":
        return [
          action.payload.resourceType,
          action.payload.amount,
          action.payload.price,
        ];
      // ... other action parameter handling
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  // Data parsing methods
  private parsePlayersData(data: any): Map<string, any> {
    // Implement player data parsing logic
    return new Map();
  }

  private parseResourcesData(data: any): Map<string, number> {
    // Implement resource data parsing logic
    return new Map();
  }

  private parseMarketData(data: any): Map<string, number> {
    // Implement market data parsing logic
    return new Map();
  }

  private parseTerritoryData(data: any): Map<string, any> {
    // Implement territory data parsing logic
    return new Map();
  }

  private parseGameState(account: any): GameState {
    // Implement game state parsing logic
    return {
      timestamp: Date.now(),
      players: new Map(),
      resources: new Map(),
      marketPrices: new Map(),
    };
  }

  private parseEvent(accountInfo: any): BlockchainEvent | null {
    // Implement event parsing logic
    return null;
  }
}
