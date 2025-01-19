export enum GameEventType {
  RESOURCE_CHANGE = "RESOURCE_CHANGE",
  PLAYER_ATTACK = "PLAYER_ATTACK",
  PLAYER_MOVE = "PLAYER_MOVE",
  MARKET_CHANGE = "MARKET_CHANGE",
  TERRITORY_CONTROL = "TERRITORY_CONTROL",
  BATTLE_START = "BATTLE_START",
  BATTLE_END = "BATTLE_END",
}

export interface GameEventData {
  RESOURCE_CHANGE: {
    resourceType: string;
    amount: number;
    location?: { x: number; y: number };
  };
  PLAYER_ATTACK: {
    attackerId: string;
    targetId: string;
    damage: number;
  };
  PLAYER_MOVE: {
    playerId: string;
    position: { x: number; y: number };
  };
  MARKET_CHANGE: {
    resourceType: string;
    price: number;
    trend: "up" | "down";
  };
  TERRITORY_CONTROL: {
    territoryId: string;
    controllerId: string;
    previousControllerId?: string;
  };
  BATTLE_START: {
    location: { x: number; y: number };
    participants: string[];
  };
  BATTLE_END: {
    winner: string;
    rewards: Map<string, number>;
  };
}
