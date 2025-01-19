import { BaseAgent } from "../core/BaseAgent";
import {
  AgentType,
  GameState,
  Action,
  GameEvent,
  GameEventType,
} from "../types";
import { Vector2D } from "../types/common";

interface NPCState {
  health: number;
  position: Vector2D;
  target?: string;
  resources: Map<string, number>;
  lastAction?: Action;
  threatLevel: number;
  mode: "PATROL" | "COMBAT" | "GATHER" | "TRADE";
  patrolPoints: Vector2D[];
  currentPatrolIndex: number;
  combatCooldown: number;
  inventory: Map<string, number>;
}

export class SimpleNPCAgent extends BaseAgent {
  private state: NPCState;
  private readonly PATROL_RADIUS = 100;
  private readonly ATTACK_RANGE = 20;
  private readonly SAFE_HEALTH_THRESHOLD = 50;
  private readonly MAX_THREAT_LEVEL = 100;
  private readonly RESOURCE_THRESHOLD = 100;

  constructor(id: string) {
    const initialState: NPCState = {
      health: 100,
      position: { x: 0, y: 0 },
      resources: new Map(),
      threatLevel: 0,
      mode: "PATROL",
      patrolPoints: generatePatrolPoints(),
      currentPatrolIndex: 0,
      combatCooldown: 0,
      inventory: new Map(),
    };

    super(id, AgentType.NPC, initialState);
    this.state = initialState;
  }

  async decide(gameState: GameState): Promise<Action> {
    // Update state assessment
    this.assessSituation(gameState);

    // Decide action based on current mode and state
    switch (this.state.mode) {
      case "PATROL":
        return this.decidePatrolAction(gameState);
      case "COMBAT":
        return this.decideCombatAction(gameState);
      case "GATHER":
        return this.decideGatherAction(gameState);
      case "TRADE":
        return this.decideTradeAction(gameState);
      default:
        return this.decidePatrolAction(gameState);
    }
  }

  private assessSituation(gameState: GameState): void {
    // Assess threat level
    const nearbyPlayers = this.findNearbyPlayers(gameState);
    const recentAttacks = this.getRecentEvents(GameEventType.PLAYER_ATTACK, 3);

    // Adjust threat level based on nearby players and recent attacks
    this.state.threatLevel = Math.min(
      this.MAX_THREAT_LEVEL,
      nearbyPlayers.length * 20 + recentAttacks.length * 30
    );

    // Determine mode based on state
    if (
      this.state.health < this.SAFE_HEALTH_THRESHOLD ||
      this.state.threatLevel > 70
    ) {
      this.state.mode = "COMBAT";
    } else if (this.shouldGatherResources(gameState)) {
      this.state.mode = "GATHER";
    } else if (this.shouldTrade(gameState)) {
      this.state.mode = "TRADE";
    } else {
      this.state.mode = "PATROL";
    }

    // Update combat cooldown
    if (this.state.combatCooldown > 0) {
      this.state.combatCooldown--;
    }
  }

  private decidePatrolAction(gameState: GameState): Action {
    const currentPoint = this.state.patrolPoints[this.state.currentPatrolIndex];
    const distance = calculateDistance(this.state.position, currentPoint);

    // If reached patrol point, select next point
    if (distance < 5) {
      this.state.currentPatrolIndex =
        (this.state.currentPatrolIndex + 1) % this.state.patrolPoints.length;
      return this.decidePatrolAction(gameState);
    }

    // Calculate movement direction
    const direction = normalizeVector({
      x: currentPoint.x - this.state.position.x,
      y: currentPoint.y - this.state.position.y,
    });

    return {
      type: "MOVE",
      payload: {
        x: this.state.position.x + direction.x * 5,
        y: this.state.position.y + direction.y * 5,
      },
    };
  }

  private decideCombatAction(gameState: GameState): Action {
    const nearbyPlayers = this.findNearbyPlayers(gameState);

    // If low health and threatened, try to escape
    if (
      this.state.health < this.SAFE_HEALTH_THRESHOLD &&
      nearbyPlayers.length > 0
    ) {
      return this.getEscapeAction(nearbyPlayers);
    }

    // If has target and within attack range, perform attack
    if (this.state.target && this.state.combatCooldown === 0) {
      const targetPlayer = this.findPlayerById(gameState, this.state.target);
      if (
        targetPlayer &&
        this.isInRange(targetPlayer.position, this.ATTACK_RANGE)
      ) {
        this.state.combatCooldown = 5; // Set attack cooldown
        return {
          type: "ATTACK",
          payload: {
            targetId: this.state.target,
            weaponId: this.selectBestWeapon(),
          },
        };
      }
    }

    // Select new target or move to target position
    const newTarget = this.selectBestTarget(nearbyPlayers);
    if (newTarget) {
      this.state.target = newTarget.id;
      return {
        type: "MOVE",
        payload: this.calculateInterceptPosition(newTarget),
      };
    }

    return this.decidePatrolAction(gameState);
  }

  private decideGatherAction(gameState: GameState): Action {
    const nearestResource = this.findNearestResource(gameState);
    if (!nearestResource) {
      return this.decidePatrolAction(gameState);
    }

    if (this.isInRange(nearestResource.position, 5)) {
      return {
        type: "GATHER",
        payload: {
          resourceId: nearestResource.id,
          amount: Math.min(100, nearestResource.amount),
        },
      };
    }

    return {
      type: "MOVE",
      payload: nearestResource.position,
    };
  }

  private decideTradeAction(gameState: GameState): Action {
    const marketPrices = gameState.marketPrices;
    const bestTrade = this.findBestTradeOpportunity(marketPrices);

    if (bestTrade) {
      return {
        type: "TRADE",
        payload: {
          resourceType: bestTrade.resource,
          amount: bestTrade.amount,
          price: bestTrade.price,
        },
      };
    }

    return this.decidePatrolAction(gameState);
  }

  // Helper methods
  private findNearbyPlayers(gameState: GameState): any[] {
    const players = Array.from(gameState.players.entries())
      .filter(([id]) => id !== this.id)
      .map(([id, data]) => ({ id, ...data }));

    return players.filter(
      (player) =>
        calculateDistance(this.state.position, player.position) <
        this.PATROL_RADIUS
    );
  }

  private shouldGatherResources(gameState: GameState): boolean {
    const totalResources = Array.from(this.state.inventory.values()).reduce(
      (sum, amount) => sum + amount,
      0
    );
    return totalResources < this.RESOURCE_THRESHOLD;
  }

  private shouldTrade(gameState: GameState): boolean {
    return Array.from(this.state.inventory.values()).some(
      (amount) => amount > this.RESOURCE_THRESHOLD * 2
    );
  }

  private getEscapeAction(threats: any[]): Action {
    // Calculate escape direction (average direction away from all threats)
    const escapeVector = threats.reduce(
      (vec, threat) => {
        const direction = normalizeVector({
          x: this.state.position.x - threat.position.x,
          y: this.state.position.y - threat.position.y,
        });
        return {
          x: vec.x + direction.x,
          y: vec.y + direction.y,
        };
      },
      { x: 0, y: 0 }
    );

    const normalizedEscape = normalizeVector(escapeVector);
    return {
      type: "MOVE",
      payload: {
        x: this.state.position.x + normalizedEscape.x * 10,
        y: this.state.position.y + normalizedEscape.y * 10,
      },
    };
  }

  private selectBestTarget(players: any[]): any {
    return players.reduce((best, current) => {
      if (!best) return current;

      const bestScore = this.calculateTargetScore(best);
      const currentScore = this.calculateTargetScore(current);

      return currentScore > bestScore ? current : best;
    }, null);
  }

  private calculateTargetScore(player: any): number {
    const distance = calculateDistance(this.state.position, player.position);
    const healthFactor = (100 - player.health) / 100;
    const distanceFactor = 1 - distance / this.PATROL_RADIUS;

    return healthFactor * 0.6 + distanceFactor * 0.4;
  }
}

// Utility functions
function generatePatrolPoints(): Vector2D[] {
  const points: Vector2D[] = [];
  const numPoints = 4;
  const radius = 100;

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    points.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
  }

  return points;
}

function calculateDistance(a: Vector2D, b: Vector2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function normalizeVector(vector: Vector2D): Vector2D {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  return {
    x: vector.x / length,
    y: vector.y / length,
  };
}
