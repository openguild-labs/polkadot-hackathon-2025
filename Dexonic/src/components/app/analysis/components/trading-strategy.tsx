import { Button } from '@/components/ui/button';
import { useSingleIndicatorStore } from '@/hooks/useSingleIndicatorStore';
import { TopOverDataItem } from '@/types/single-indicator';
import { cn } from '@/utils';
import { useMemo } from 'react';
interface TradingStrategyProps {
    signal: 'sold' | 'bought';
    item: TopOverDataItem;
}
export default function TradingStrategy({ item, signal }: TradingStrategyProps) {
    const { type } = useSingleIndicatorStore();

    const entryPoint = useMemo(() => {
        if (item?.low && item?.high && signal) {
            return signal === 'sold' ? item.high : item.low;
        }
        return 0;
    }, [item?.low, item?.high, signal]);

    const dca1 = useMemo(() => {
        if (item?.low && item?.high) {
            return (item.low + item.high) / 2;
        }
        return 0;
    }, [item?.low, item?.high]);

    const dca2 = useMemo(() => {
        if (item?.low && item?.high && signal) {
            return signal === 'sold' ? item.low : item.high;
        }
        return 0;
    }, [item?.low, item?.high, signal]);

    const targetPoint = useMemo(() => {
        if (item?.low && item?.high && signal) {
            return signal === 'sold' ? item.high * 1.05 : item.low * 0.95;
        }
        return 0;
    }, [item?.low, item?.high, signal]);

    const stopLoss = useMemo(() => {
        if (item?.low && item?.high && signal) {
            return signal === 'sold' ? item.low * 0.95 : item.high * 1.05;
        }
        return 0;
    }, [item?.low, item?.high, signal]);

    const componentData = [
        { label: 'Entry Point', value: entryPoint.toPrecision(5), textColor: 'text-gray-900' },
        { label: 'DCA1', value: dca1.toPrecision(5), textColor: 'text-blue-600' },
        { label: 'DCA2', value: dca2.toPrecision(5), textColor: 'text-blue-600' },
        { label: 'Target Point', value: targetPoint.toPrecision(5), textColor: 'text-green-600' },
        { label: 'Stop Loss', value: stopLoss.toPrecision(5), textColor: 'text-red-600' },
    ];
    return (
        <div className="mx-auto max-w-md border-none bg-transparent py-6 shadow-none">
            <div className="text-md mb-2 text-center font-bold">Trading Strategy</div>

            <h3
                className={cn('mb-6 text-center text-3xl font-bold', {
                    'text-green-600': signal === 'sold',
                    'text-red-600': signal === 'bought',
                })}
            >
                {item.name}
            </h3>

            <div className="mb-2 flex justify-between text-sm">
                <div>
                    <span>Signal: </span>
                    <span
                        className={cn('', {
                            'text-green-600': signal === 'sold',
                            'text-red-600': signal === 'bought',
                        })}
                    >
                        Over {signal.charAt(0).toUpperCase() + signal.slice(1)}
                    </span>
                </div>
                <div className="text-end">
                    <span>Indicator: </span>
                    <span className="text-blue-600">
                        {type} ~ <span>{item.rsi.toPrecision(4)}</span>
                    </span>
                </div>
            </div>

            {componentData.map((item, index) => (
                <div
                    key={index}
                    className="mb-3 flex items-center justify-between rounded-lg bg-gray-200 p-4"
                >
                    <span className="font-medium text-gray-600">{item.label}</span>
                    <span className={`font-bold ${item.textColor}`}>${item.value}</span>
                </div>
            ))}

            <Button className="mt-4 w-full" disabled>
                Save
            </Button>
        </div>
    );
}
