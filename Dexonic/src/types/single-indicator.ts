export type TopOverData = {
    symbol: string;
    rsi: number;
    close: number;
    high: number;
    low: number;
    rsi_bottom: number;
    rsi_top: number;
    dateCreated: string;
};

export type TopOverDataItem = {
    key: number;
    name: string;
    rsi: number;
    close: number;
    high: number;
    low: number;
    discoveredOn: string;
};

export type HeatMapData = {
    symbol: string;
    rsi: number;
    percentageChange: number;
};
