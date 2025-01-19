/* eslint-disable @typescript-eslint/no-explicit-any */
import { CryptoData, CryptoPrediction } from '@/models';
import { AIPrediction, SymbolStats } from '@/types';
import { convertToLocalTime } from '@/utils';
import { get } from '@/utils/axios';
// import { number } from 'echarts';

const getLastestPrice = async (): Promise<CryptoData[]> => {
    return await get(`/prices/coin-prices/`);
};

const getPredictions = async (): Promise<CryptoPrediction[]> => {
    return await get(`/ai-analysis/get-predictions/`).then((data) => {
        return data.map((item: CryptoPrediction) => {
            return {
                symbol: item.symbol,
                update_time: convertToLocalTime(Number(item.update_time)),
                target_time: convertToLocalTime(Number(item.target_time)),
                price: item.price,
                prediction: item.prediction,
                price_change: item.price_change,
            } as CryptoPrediction;
        });
    });
};

const getPredictionsValidate = async (symbol: string, n_predict: number): Promise<SymbolStats> => {
    return get(`/ai-analysis/predict-validate/${symbol}?n_predict=${n_predict}`)
        .then((data) => {
            return {
                mae: data.mae,
                avgErrRate: data.avg_err_rate,
                highestProfitRate: data.max_profit_rate,
                lowestProfitRate: data.max_loss_rate,
                meanProfitRate: data.avg_profit_rate,
                accuracy: data.accuracy,
                allTrades: data.n_trade,
                winTrades: data.true_pred,
                loseTrades: data.false_pred,
            } as SymbolStats;
        })
        .catch(() => {
            return {} as SymbolStats;
        });
};

const getPredictionsValidateTotalSummary = async (): Promise<AIPrediction> => {
    return get(`/ai-analysis/predict-validate`).then((data) => {
        return {
            mae: data.mae,
            avgErrRate: data.avg_err_rate,
            highestProfitRate: data.max_profit_rate,
            lowestProfitRate: data.max_loss_rate,
            meanProfitRate: data.avg_profit_rate,
            accuracy: data.accuracy,
            allTrades: data.n_trade,
            winTrades: data.true_pred,
            loseTrades: data.false_pred,
        };
    });
};

export {
    getLastestPrice,
    getPredictions,
    getPredictionsValidate,
    getPredictionsValidateTotalSummary,
};
