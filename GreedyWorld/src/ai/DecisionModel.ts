import { BaseAIModel } from "./BaseAIModel";
import * as tf from "@tensorflow/tfjs-node";
import { GameState } from "../types";
import { AIModelConfig } from "../types/ai";

export class DecisionModel extends BaseAIModel {
  constructor(config: AIModelConfig) {
    super(config);
    this.createModel();
  }

  protected async createModel(): Promise<void> {
    const { hiddenLayers = [64, 32], activationFunction = "relu" } =
      this.config.parameters;

    this.model = tf.sequential();

    // Input layer
    this.model.add(
      tf.layers.dense({
        units: hiddenLayers[0],
        activation: activationFunction,
        inputShape: [10], // Assuming input features dimension is 10
      })
    );

    // Hidden layers
    for (let i = 1; i < hiddenLayers.length; i++) {
      this.model.add(
        tf.layers.dense({
          units: hiddenLayers[i],
          activation: activationFunction,
        })
      );
    }

    // Output layer
    this.model.add(
      tf.layers.dense({
        units: 4, // Assuming 4 possible decisions
        activation: "softmax",
      })
    );

    this.model.compile({
      optimizer: tf.train.adam(this.config.parameters.learningRate),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });
  }

  async predict(gameState: GameState): Promise<number[]> {
    const input = this.preprocessState(gameState);
    const prediction = (await this.model.predict(input)) as tf.Tensor;
    return Array.from(prediction.dataSync());
  }

  async train(
    data: Array<{ state: GameState; label: number[] }>
  ): Promise<void> {
    const inputs = data.map((d) => this.preprocessState(d.state));
    const labels = data.map((d) => d.label);

    const xs = tf.stack(inputs);
    const ys = tf.tensor2d(labels);

    const result = await this.model.fit(xs, ys, {
      epochs: 10,
      batchSize: 32,
      validationSplit: 0.2,
    });

    this.state.modelMetrics = {
      accuracy: result.history.acc[result.history.acc.length - 1],
      loss: result.history.loss[result.history.loss.length - 1],
    };
  }

  private preprocessState(state: GameState): tf.Tensor {
    // Convert game state to model input format
    // This should be adjusted according to specific game state
    const features = [
      state.timestamp,
      state.players.size,
      state.resources.size,
      // ... other features
    ];

    return tf.tensor2d([features], [1, features.length]);
  }
}
