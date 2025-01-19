/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { cn } from '@/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { TopOverDataItem } from '@/types/single-indicator';
import { TableCell, TableRow } from '@/components/ui/table';
import TradingStrategy from './trading-strategy';
import { useEffect, useState } from 'react';

interface TopOverDataProps {
    signal: 'sold' | 'bought';
    item: TopOverDataItem;
}

export default function TopOverDataComponent({ signal, item }: TopOverDataProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [delayedState, setDelayedState] = useState(isSheetOpen);
    let timeoutId: NodeJS.Timeout;
    const onOpenChange = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            setDelayedState(!delayedState);
        }, 200);
    };

    useEffect(() => {
        setIsSheetOpen(delayedState);
    }, [delayedState]);
    return (
        <>
            <TableRow onClick={onOpenChange}>
                <TableCell
                    className={cn(
                        'font-medium',
                        signal == 'sold' ? 'text-green-500' : 'text-red-500',
                    )}
                >
                    {item.name}
                </TableCell>
                <TableCell className="text-right">
                    <div>{item.discoveredOn.split(' ')[0]}</div>
                    <div>{item.discoveredOn.split(' ')[1]}</div>
                </TableCell>
            </TableRow>
            <Sheet open={isSheetOpen} onOpenChange={onOpenChange}>
                <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
                    <TradingStrategy item={item} signal={signal} />
                </SheetContent>
            </Sheet>
        </>
    );
}
