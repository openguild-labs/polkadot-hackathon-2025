import { MarketPair } from '@/@type/pair.type';
import { GetPairsParams, getAllMarketPair } from '@/apis/pair.api';
import useMarketStore from '@/stores/market.store';
// import { handleRequest } from '@/utils/helpers';
// import { useCallback } from 'react';

type ParamsGetPair = GetPairsParams & { marketPairs: MarketPair[]; };

const sortType = (sort: string | undefined) => {
    // true: desc 
    // false: asc
    return sort?.includes('-');
};
const useMarketPair = () => {
    // const [marketPairs] = useMarketStore(state => [state.marketPairs]);

    const getMarketPairAsync = (async ({ page = 0, marketPairs, ...params }: ParamsGetPair) => {
        // const [err, response] = await handleRequest(getAllMarketPair());
        // if(err) return []
        let data: MarketPair[] = [...marketPairs];
        const offset = (page + 1) * 10 - 1;

        if (params.sort) {
            const symbol = params.sort.includes('symbol');
            const last_price = params.sort.includes('last_price');
            const price_change = params.sort.includes('price_change');
            if (symbol) {
                data = await data.sort((item1, item2) => {
                    if (item1.symbol < item2.symbol) {
                        if (sortType(params.sort)) return 1;
                        return -1;
                    }
                    if (item1.symbol > item2.symbol) {
                        if (sortType(params.sort)) return -1;
                        return 1;
                    }
                    return 0;
                });
            }
            if (last_price) {
                data = await data.sort((item1, item2) => {
                    if (+item1.lastPrice < +item2.lastPrice) {
                        if (sortType(params.sort)) return 1;
                        return -1;
                    }

                    if (+item1.lastPrice > +item2.lastPrice) {
                        if (sortType(params.sort)) return -1;
                        return 1;
                    }
                    return 0;
                });
            }
            if (price_change) {
                data = await data.sort((item1, item2) => {
                    if (Number(item1.priceChangePercent) < Number(item2.priceChangePercent)) {
                        if (sortType(params.sort)) return 1;
                        return -1;
                    }
                    if (Number(item1.priceChangePercent) > Number(item2.priceChangePercent)) {
                        if (sortType(params.sort)) return -1;
                        return 1;
                    }
                    return 0;
                });
            }
        }

        if (params.q) {
            data = await data.filter(item => item.symbol.toLowerCase().includes(params.q?.toLowerCase() || ''));
        }
        // data = await data.slice(page * 10, offset + 1);
        return data;
    });

    return { getMarketPairAsync };
};

export default useMarketPair;