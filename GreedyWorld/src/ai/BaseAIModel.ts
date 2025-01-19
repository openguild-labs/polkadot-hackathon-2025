import * as tf from "@tensorflow/tfjs-node";
import { IAIModel, AIModelConfig, AIState } from "../types/ai";

export abstract class BaseAIModel implements IAIModel {
  protected model: tf.LayersModel | null = null;
  protected config: AIModelConfig;
  protected state: AIState;

  constructor(config: AIModelConfig) {
    this.config = config;
    this.state = {
      confidence: 0,
      modelMetrics: {},
    };
  }

  abstract predict(input: any): Promise<any>;
  abstract train(data: any[]): Promise<void>;

  async save(path: string): Promise<void> {
    if (!this.model) {
      throw new Error("Model not initialized");
    }
    await this.model.save(`file://${path}`);
  }

  async load(path: string): Promise<void> {
    this.model = await tf.loadLayersModel(`file://${path}`);
  }

  protected abstract createModel(): Promise<void>;
}
