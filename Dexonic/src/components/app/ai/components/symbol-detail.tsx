import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPredictionsValidate } from '@/services';
import { SymbolStats } from '@/types';
import { isNil } from 'lodash';
import { useEffect, useState } from 'react';

export default function SymbolDetail({ symbol }: { symbol: string }) {
    const nPredict = 1000;
    const [data, setData] = useState<SymbolStats>(null!);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await getPredictionsValidate(symbol, nPredict);
                setData(response);
            } catch {
                setData(null!);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [symbol]);

    if (isLoading || isNil(data)) {
        return (
            <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Skeleton className="h-4 w-[100px]" />
                            </CardTitle>
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[80px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }
    return (
        <div className="w-full rounded-lg py-6">
            <div className="mb-4 text-center font-bold text-white">AI Performance Snapshot</div>
            <div className="space-y-4">
                <InfoItem label="Number of Trades" value={(data.allTrades || 0).toString()} />
                {/* <InfoItem
                    label="Average Profit Rate"
                    value={`${(data.meanProfitRate * 100).toFixed(2)}%`}
                    className={`${data.meanProfitRate > 0 ? 'text-green-500' : data.meanProfitRate < 0 ? 'text-red-500' : ''}`}
                /> */}
                <InfoItem
                    label="Total Win Trades"
                    value={(data.winTrades || 0).toString()}
                    className="text-blue-500"
                />
                <InfoItem
                    label="Total Loss Trades"
                    value={(data.loseTrades || 0).toString()}
                    className="text-blue-500"
                />
                <InfoItem
                    label="Highest Gain Rate"
                    value={`${data.highestProfitRate > 0 ? '' : '-'}${(data.highestProfitRate * 100).toFixed(2)}%`}
                    className={'text-green-500'}
                />
                <InfoItem
                    label="Highest Loss Rate"
                    value={`${data.lowestProfitRate > 0 ? '' : '-'}${(data.lowestProfitRate * 100).toFixed(2)}%`}
                    className="text-red-500"
                />
            </div>
        </div>
    );
}

function InfoItem({
    label,
    value,
    className,
}: {
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div className="flex items-center justify-between rounded">
            <span className="text-gray-400">{label}</span>
            <span className={`font-medium ${className}`}>{value}</span>
        </div>
    );
}
