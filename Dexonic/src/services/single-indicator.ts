import { RsiType, interval } from '@/types';
import { HeatMapData, TopOverData } from '@/types/single-indicator';
import { convertToLocalTime } from '@/utils';
import { get } from '@/utils/axios';

const getHeatmapChartData = async (
    heatMapType: RsiType,
    interval: interval,
): Promise<HeatMapData[]> => {
    return await get(
        `/al-trade/chart-data/v2.2?heatMapType=${heatMapType}&interval=${interval}`,
    ).then((data) => {
        return data.map((item: { symbol: string; rsi: number; percentage_change: number }) => {
            return {
                symbol: item.symbol,
                rsi: item.rsi,
                percentageChange: item.percentage_change,
            } as HeatMapData;
        });
    });
};

const getTopOverBoughtData = async (
    heatMapType: RsiType,
    interval: interval,
): Promise<TopOverData[]> => {
    return await get(
        `/al-trade/top-over-bought/v2.2?heatMapType=${heatMapType}&interval=${interval}`,
    ).then((data) => {
        return data.map((item: TopOverData) => {
            return {
                symbol: item.symbol,
                rsi: item.rsi,
                close: item.close,
                high: item.high,
                low: item.low,
                rsi_bottom: item.rsi_bottom,
                rsi_top: item.rsi_top,
                dateCreated: convertToLocalTime(Number(item.dateCreated)),
            } as TopOverData;
        });
    });
};

const getTopOverSoldData = async (
    heatMapType: RsiType,
    interval: interval,
): Promise<TopOverData[]> => {
    return await get(
        `/al-trade/top-over-sold/v2.2?heatMapType=${heatMapType}&interval=${interval}`,
    ).then((data) => {
        return data.map((item: TopOverData) => {
            return {
                symbol: item.symbol,
                rsi: item.rsi,
                close: item.close,
                high: item.high,
                low: item.low,
                rsi_bottom: item.rsi_bottom,
                rsi_top: item.rsi_top,
                dateCreated: convertToLocalTime(Number(item.dateCreated)),
            } as TopOverData;
        });
    });
};

export { getHeatmapChartData, getTopOverBoughtData, getTopOverSoldData };
