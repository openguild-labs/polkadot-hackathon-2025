import { IAgent, GameState, IBlockchainAdapter, Action } from "../types";
import { EventManager } from "./EventManager";
import { DatabaseManager } from "../db/DatabaseManager";
import { EventStorageService } from "../services/EventStorageService";
import { AgentStorageService } from "../services/AgentStorageService";

export class GameManager {
  private agents: Map<string, IAgent> = new Map();
  private blockchain: IBlockchainAdapter;
  private eventManager: EventManager;
  private eventStorage: EventStorageService;
  private agentStorage: AgentStorageService;
  private gameState: GameState;

  constructor(blockchain: IBlockchainAdapter) {
    this.blockchain = blockchain;
    this.eventManager = new EventManager();
    this.eventStorage = EventStorageService.getInstance();
    this.agentStorage = AgentStorageService.getInstance();
    this.gameState = {
      timestamp: Date.now(),
      players: new Map(),
      resources: new Map(),
    };
  }

  async initialize(): Promise<void> {
    // Initialize database
    await DatabaseManager.getInstance().initialize();

    // Connect to blockchain
    await this.blockchain.connect();

    // Subscribe to blockchain events
    this.blockchain.subscribeToEvents(async (event) => {
      await this.eventStorage.storeEvent(
        event.type,
        event.data,
        event.blockNumber
      );
      this.eventManager.emit(event);
    });

    // Load existing agents from database
    const agents = await this.agentStorage.getAllAgents();
    agents.forEach((agent) => {
      // Recreate agent instances
      // This part depends on your agent creation logic
    });
  }

  async registerAgent(agent: IAgent): Promise<void> {
    this.agents.set(agent.id, agent);
    await this.agentStorage.createAgent(
      agent.id,
      agent.type,
      agent.state,
      (agent as any).aiModel?.config
    );
  }

  async update(): Promise<void> {
    this.gameState = await this.blockchain.getGameState();

    for (const agent of this.agents.values()) {
      const action = await agent.decide(this.gameState);
      await this.executeAction(agent.id, action);

      // Update agent state in database
      await this.agentStorage.updateAgentState(agent.id, agent.state);
    }
  }

  private async executeAction(agentId: string, action: Action): Promise<void> {
    await this.blockchain.executeTransaction(action);
  }
}
