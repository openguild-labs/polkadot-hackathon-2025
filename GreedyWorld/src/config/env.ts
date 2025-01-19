import dotenv from "dotenv";
dotenv.config();

export const config = {
  blockchain: {
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || "http://localhost:8545",
    contractAddress: process.env.CONTRACT_ADDRESS || "",
    networkId: parseInt(process.env.NETWORK_ID || "1"),
  },
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    name: process.env.DB_NAME || "web3_game_ai",
  },
  ai: {
    modelPath: process.env.AI_MODEL_PATH || "./models",
    defaultConfig: {
      modelType: "neural-network",
      parameters: {
        learningRate: 0.001,
        hiddenLayers: [64, 32],
        activationFunction: "relu",
      },
    },
  },
  game: {
    updateInterval: parseInt(process.env.GAME_UPDATE_INTERVAL || "1000"),
    maxAgents: parseInt(process.env.MAX_AGENTS || "100"),
  },
};
