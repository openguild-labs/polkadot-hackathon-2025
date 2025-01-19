export interface IAIModel {
  predict(input: any): Promise<any>;
  train(data: any[]): Promise<void>;
  save(path: string): Promise<void>;
  load(path: string): Promise<void>;
}

export interface AIModelConfig {
  modelType: string;
  parameters: {
    learningRate?: number;
    hiddenLayers?: number[];
    activationFunction?: string;
    [key: string]: any;
  };
}

export interface AIState {
  lastPrediction?: any;
  confidence: number;
  modelMetrics?: {
    accuracy?: number;
    loss?: number;
    [key: string]: any;
  };
}
