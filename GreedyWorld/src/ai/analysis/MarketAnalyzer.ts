import { ExponentialMovingAverage } from "../utils/indicators";

export class MarketAnalyzer {
  private ema: ExponentialMovingAverage;
  private readonly TREND_THRESHOLD = 0.05;

  constructor() {
    this.ema = new ExponentialMovingAverage(20); // 20-period EMA
  }

  async predictTrends(
    historicalData: any[],
    currentPrices: Map<string, number>
  ): Promise<{
    predictions: Map<string, { trend: string; confidence: number }>;
    opportunities: Array<{
      type: "BUY" | "SELL";
      resource: string;
      price: number;
      confidence: number;
    }>;
  }> {
    const predictions = new Map();
    const opportunities = [];

    for (const [resource, currentPrice] of currentPrices.entries()) {
      const priceHistory = this.extractPriceHistory(historicalData, resource);
      const trend = this.analyzeTrend(priceHistory, currentPrice);
      const volatility = this.calculateVolatility(priceHistory);
      const support = this.findSupportLevel(priceHistory);
      const resistance = this.findResistanceLevel(priceHistory);

      predictions.set(resource, {
        trend: trend.direction,
        confidence: trend.strength,
      });

      if (
        this.shouldTrade(currentPrice, trend, volatility, support, resistance)
      ) {
        opportunities.push({
          type: trend.direction === "up" ? "BUY" : "SELL",
          resource,
          price: currentPrice,
          confidence: trend.strength,
        });
      }
    }

    return { predictions, opportunities };
  }

  private extractPriceHistory(
    historicalData: any[],
    resource: string
  ): number[] {
    return historicalData.map((entry) => entry.prices.get(resource) || 0);
  }

  private analyzeTrend(
    priceHistory: number[],
    currentPrice: number
  ): { direction: string; strength: number } {
    const emaValue = this.ema.calculate(priceHistory);
    const trendStrength = Math.abs((currentPrice - emaValue) / emaValue);

    return {
      direction: currentPrice > emaValue ? "up" : "down",
      strength: Math.min(trendStrength / this.TREND_THRESHOLD, 1),
    };
  }

  private calculateVolatility(priceHistory: number[]): number {
    if (priceHistory.length < 2) return 0;

    const returns = [];
    for (let i = 1; i < priceHistory.length; i++) {
      returns.push(
        (priceHistory[i] - priceHistory[i - 1]) / priceHistory[i - 1]
      );
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance =
      returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;

    return Math.sqrt(variance);
  }

  private findSupportLevel(priceHistory: number[]): number {
    return Math.min(...priceHistory);
  }

  private findResistanceLevel(priceHistory: number[]): number {
    return Math.max(...priceHistory);
  }

  private shouldTrade(
    currentPrice: number,
    trend: { direction: string; strength: number },
    volatility: number,
    support: number,
    resistance: number
  ): boolean {
    const priceNearSupport = currentPrice <= support * 1.1;
    const priceNearResistance = currentPrice >= resistance * 0.9;
    const strongTrend = trend.strength > 0.7;
    const lowVolatility = volatility < 0.1;

    return (
      ((trend.direction === "up" && priceNearSupport && strongTrend) ||
        (trend.direction === "down" && priceNearResistance && strongTrend)) &&
      lowVolatility
    );
  }
}
