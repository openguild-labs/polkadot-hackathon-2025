import {
  IAgent,
  AgentType,
  AgentState,
  GameState,
  Action,
  GameEvent,
} from "../types";
import { GameEventType, GameEventData } from "../types/events";

export abstract class BaseAgent implements IAgent {
  id: string;
  type: AgentType;
  state: AgentState;
  protected eventHistory: GameEvent[] = [];
  protected behaviorAdjustments: Map<GameEventType, number> = new Map();

  constructor(id: string, type: AgentType, initialState: AgentState) {
    this.id = id;
    this.type = type;
    this.state = initialState;
    this.initializeBehaviorAdjustments();
  }

  abstract decide(gameState: GameState): Promise<Action>;

  update(event: GameEvent): void {
    this.eventHistory.push(event);
    this.handleEvent(event);
    this.updateBehaviorAdjustments(event);
  }

  protected handleEvent(event: GameEvent): void {
    switch (event.type as GameEventType) {
      case GameEventType.RESOURCE_CHANGE:
        this.handleResourceChange(
          event.data as GameEventData["RESOURCE_CHANGE"]
        );
        break;
      case GameEventType.PLAYER_ATTACK:
        this.handlePlayerAttack(event.data as GameEventData["PLAYER_ATTACK"]);
        break;
      case GameEventType.MARKET_CHANGE:
        this.handleMarketChange(event.data as GameEventData["MARKET_CHANGE"]);
        break;
      case GameEventType.BATTLE_START:
        this.handleBattleStart(event.data as GameEventData["BATTLE_START"]);
        break;
    }
  }

  protected initializeBehaviorAdjustments(): void {
    Object.values(GameEventType).forEach((eventType) => {
      this.behaviorAdjustments.set(eventType, 1.0);
    });
  }

  protected updateBehaviorAdjustments(event: GameEvent): void {
    const currentAdjustment =
      this.behaviorAdjustments.get(event.type as GameEventType) || 1.0;
    const newAdjustment = this.calculateAdjustment(event, currentAdjustment);
    this.behaviorAdjustments.set(event.type as GameEventType, newAdjustment);
  }

  protected calculateAdjustment(
    event: GameEvent,
    currentAdjustment: number
  ): number {
    // Implement adjustment calculation based on event type and impact
    return currentAdjustment;
  }

  protected handleResourceChange(data: GameEventData["RESOURCE_CHANGE"]): void {
    // Update agent's resource awareness
    if (this.state.resources) {
      const currentAmount = this.state.resources.get(data.resourceType) || 0;
      this.state.resources.set(data.resourceType, currentAmount + data.amount);
    }
  }

  protected handlePlayerAttack(data: GameEventData["PLAYER_ATTACK"]): void {
    // Update combat state and strategy
    if (data.targetId === this.id) {
      this.state.health = Math.max(0, (this.state.health || 0) - data.damage);
    }
  }

  protected handleMarketChange(data: GameEventData["MARKET_CHANGE"]): void {
    // Update market awareness and trading strategy
    if (!this.state.marketPrices) {
      this.state.marketPrices = new Map();
    }
    this.state.marketPrices.set(data.resourceType, data.price);
  }

  protected handleBattleStart(data: GameEventData["BATTLE_START"]): void {
    // Update battle participation and strategy
    if (data.participants.includes(this.id)) {
      this.state.inBattle = true;
      this.state.battleLocation = data.location;
    }
  }

  protected getRecentEvents(
    eventType: GameEventType,
    count: number = 5
  ): GameEvent[] {
    return this.eventHistory
      .filter((event) => event.type === eventType)
      .slice(-count);
  }
}
