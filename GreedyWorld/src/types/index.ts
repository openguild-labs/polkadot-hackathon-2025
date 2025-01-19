// 定义核心接口
export interface IAgent {
  id: string;
  type: AgentType;
  state: AgentState;
  decide(gameState: GameState): Promise<Action>;
  update(event: GameEvent): void;
}

export interface IBlockchainAdapter {
  connect(): Promise<boolean>;
  getGameState(): Promise<GameState>;
  executeTransaction(action: Action): Promise<boolean>;
  subscribeToEvents(callback: (event: BlockchainEvent) => void): void;
}

export enum AgentType {
  NPC = "NPC",
  TRADER = "TRADER",
  RESOURCE_MANAGER = "RESOURCE_MANAGER",
}

export interface AgentState {
  position?: Position;
  resources?: Map<string, number>;
  health?: number;
  [key: string]: any;
}

export interface GameState {
  timestamp: number;
  players: Map<string, AgentState>;
  resources: Map<string, number>;
  [key: string]: any;
}

export interface Action {
  type: string;
  payload: any;
}

export interface GameEvent {
  type: string;
  data: any;
  timestamp: number;
}

export interface BlockchainEvent {
  type: string;
  data: any;
  blockNumber: number;
}
