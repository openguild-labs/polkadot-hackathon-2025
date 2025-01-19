'use client';
import { useEffect, useState } from 'react';
import { useSingleIndicatorStore } from '@/hooks/useSingleIndicatorStore';
import { cn } from '@/utils';
import { getTopOverBoughtData } from '@/services/single-indicator';
import { TopOverData } from '@/types/single-indicator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import TopOverDataComponent from './top-over-data';

type TopOverBoughtProps = {
    className?: string;
};

export const TopOverBought = ({ className }: TopOverBoughtProps) => {
    const { type, time, topOverBoughtData, setData } = useSingleIndicatorStore();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        getTopOverBoughtData(type, time)
            .then((data) => {
                const newData = data.map((item: TopOverData, index: number) => {
                    return {
                        key: index,
                        name: item.symbol,
                        rsi: item.rsi,
                        close: item.close,
                        high: item.high,
                        low: item.low,
                        rsi_bottom: item.rsi_bottom,
                        rsi_top: item.rsi_top,
                        discoveredOn: item.dateCreated,
                    };
                });
                setData('bought', newData);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [type, time, setData]);

    return (
        <div className={cn(className)}>
            <div className="px-6 pt-6">
                <div className="mt-4">
                    {isLoading ? (
                        Array.from({ length: 7 }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="ml-auto h-4 w-full" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : topOverBoughtData.length === 0 ? (
                        <div className="text-center">No data</div>
                    ) : (
                        <div className="overflow-y">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow isHeader>
                                        <TableHead className="text-left">NAME</TableHead>
                                        <TableHead className="text-right">DISCOVERED ON</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topOverBoughtData.map((item) => (
                                        // <TableRow
                                        //     key={item.name}
                                        //     className={rowClassName(item)}
                                        //     onClick={() => onRowClick(item)}
                                        // >
                                        //     <TableCell className="font-medium text-red-500">
                                        //         {item.name}
                                        //     </TableCell>
                                        //     <TableCell className="text-right">
                                        //         {item.discoveredOn.slice(0, -9)}
                                        //     </TableCell>
                                        // </TableRow>
                                        <TopOverDataComponent
                                            signal="bought"
                                            key={item.name}
                                            item={item}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
