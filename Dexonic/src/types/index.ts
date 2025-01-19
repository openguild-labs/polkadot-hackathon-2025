export type RsiType = 'RSI7' | 'RSI14';
export type interval = '1d' | '4h' | '1h' | '30m' | '5m';

export interface SymbolStats {
    mae: number;
    avgErrRate: number;
    highestProfitRate: number;
    lowestProfitRate: number;
    meanProfitRate: number;
    accuracy: number;
    allTrades: number;
    winTrades: number;
    loseTrades: number;
}

export interface AIPrediction {
    allTrades: number;
    highestProfitRate: number;
    lowestProfitRate: number;
    winTrades: number;
    loseTrades: number;
}
