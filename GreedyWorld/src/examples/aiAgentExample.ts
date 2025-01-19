import { AIAgent } from "../ai/AIAgent";
import { AgentType } from "../types";
import { config } from "../config/env";

async function main() {
  const aiAgent = new AIAgent(
    "ai-agent-1",
    AgentType.NPC,
    {
      health: 100,
      position: { x: 0, y: 0 },
    },
    config.ai.defaultConfig
  );

  // Training data example
  const trainingData = [
    {
      state: {
        timestamp: Date.now(),
        players: new Map(),
        resources: new Map(),
      },
      label: [1, 0, 0, 0], // MOVE action
    },
    // ... more training data
  ];

  // Train the model
  await aiAgent.trainModel(trainingData);

  // Use model for decision making
  const gameState = {
    timestamp: Date.now(),
    players: new Map(),
    resources: new Map(),
  };

  const action = await aiAgent.decide(gameState);
  console.log("AI Agent Decision:", action);
}

main().catch(console.error);
