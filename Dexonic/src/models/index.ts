interface CryptoData {
    symbol: string;
    price: number;
    price_change: number;
    list_prices: number[];
}

interface CryptoPrediction {
    symbol: string;
    update_time: string;
    target_time: string;
    price: number;
    prediction: number;
    price_change: number;
}

interface AIChatbot {
    query: string;
    reply: string;
}

export type { CryptoData, CryptoPrediction, AIChatbot };
