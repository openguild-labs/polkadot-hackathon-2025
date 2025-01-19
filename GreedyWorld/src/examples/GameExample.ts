import { GameManager } from "../core/GameManager";
import { AIAgent } from "../ai/AIAgent";
import { SimpleNPCAgent } from "./SimpleNPCAgent";
import { AgentType, GameState } from "../types";
import { config } from "../config/env";
import { EthereumAdapter } from "../blockchain/EthereumAdapter";

async function initializeGame() {
  // Initialize blockchain adapter
  const blockchain = new EthereumAdapter(
    config.blockchain.rpcUrl,
    config.blockchain.contractAddress
  );

  // Create game manager
  const gameManager = new GameManager(blockchain);
  await gameManager.initialize();

  // Create AI agents
  const trader = new AIAgent(
    "trader-1",
    AgentType.TRADER,
    {
      resources: new Map([
        ["gold", 1000],
        ["wood", 500],
      ]),
    },
    {
      modelType: "neural-network",
      parameters: {
        learningRate: 0.001,
        hiddenLayers: [64, 32],
        activationFunction: "relu",
      },
    }
  );

  const npc = new SimpleNPCAgent("npc-1");

  // Register agents
  gameManager.registerAgent(trader);
  gameManager.registerAgent(npc);

  return gameManager;
}

async function runGameLoop(gameManager: GameManager) {
  const updateInterval = config.game.updateInterval;

  setInterval(async () => {
    try {
      await gameManager.update();
    } catch (error) {
      console.error("Game loop error:", error);
    }
  }, updateInterval);
}

async function main() {
  const gameManager = await initializeGame();
  await runGameLoop(gameManager);
}

main().catch(console.error);
