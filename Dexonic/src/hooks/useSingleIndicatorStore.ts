import { create } from 'zustand';
import { interval, RsiType } from '@/types';
import { TopOverDataItem } from '@/types/single-indicator';

type singleIndicatorFilterType = {
    type: RsiType;
    time: interval;
    topOverSoldData: TopOverDataItem[];
    topOverBoughtData: TopOverDataItem[];
    setData: (type: 'sold' | 'bought', data: TopOverDataItem[]) => void;
    setType: (type: RsiType) => void;
    setTime: (time: interval) => void;
};

export const useSingleIndicatorStore = create<singleIndicatorFilterType>((set) => ({
    type: 'RSI7',
    time: '5m',
    topOverSoldData: [],
    topOverBoughtData: [],
    setData: (type: 'sold' | 'bought', data: TopOverDataItem[]) => {
        if (type === 'sold') {
            set({ topOverSoldData: data });
        } else {
            set({ topOverBoughtData: data });
        }
    },
    setType: (type: RsiType) => set({ type }),
    setTime: (time: interval) => set({ time }),
}));
