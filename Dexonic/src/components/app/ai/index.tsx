'use client';
import { Images } from '@/components/common/images';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import ChangeBadge from './components/changebadge';
import { getPredictions } from '@/services';
import { useEffect, useState } from 'react';
import { isNil } from 'lodash';
import { CryptoPrediction } from '@/models';
import { Skeleton } from '@/components/ui/skeleton';
import SheetComponent, { SheetState } from './components/sheet-components';
import HeroBanner from './components/hero-banner';

export default function AiPrediction() {
    const [sheet, setSheet] = useState<SheetState>({ isOpen: false });
    const [predictionsData, setPredictionsData] = useState<CryptoPrediction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [delayedSheet, setDelayedSheet] = useState(sheet);
    let timeoutId: NodeJS.Timeout;

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await getPredictions();
                console.log('Fetched Predictions:', response);
                setPredictionsData(response);
            } catch (error) {
                console.error('Error fetching predictions:', error);
                setPredictionsData([]);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const handleClick = (item: CryptoPrediction) => {
        onOpenChange({
            isOpen: true,
            symbol: item.symbol,
            price: item.price.toString(),
            prediction: item.prediction.toString(),
        });
    };

    const onOpenChange = (sheet: SheetState) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            setDelayedSheet({
                ...sheet,
                isOpen: sheet.isOpen,
            });
        }, 200);
    };

    useEffect(() => {
        setSheet(delayedSheet);
    }, [delayedSheet, setSheet]);

    return (
        <>
            <div className="mx-auto max-w-md bg-black px-4 text-white">
                <HeroBanner />
                <Table>
                    <TableHeader>
                        <TableRow isHeader>
                            <TableHead className="w-4/11 text-start font-bold text-white">
                                Cryptocurrency
                            </TableHead>
                            {/* <TableHead className="w-3/11 text-center">Update Time</TableHead> */}
                            <TableHead className="w-3/11 text-center font-bold text-white">
                                Target Time
                            </TableHead>
                            <TableHead className="w-4/11 text-end font-bold text-white">
                                Next Change
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading
                            ? Array.from({ length: 7 }).map((_, index) => (
                                  <TableRow key={index}>
                                      <TableCell>
                                          <Skeleton className="h-4 w-[100px]" />
                                      </TableCell>
                                      <TableCell>
                                          <Skeleton className="h-4 w-[100px]" />
                                      </TableCell>
                                  </TableRow>
                              ))
                            : !isNil(predictionsData) &&
                              predictionsData.length > 0 &&
                              predictionsData.map((item: CryptoPrediction, index: number) => (
                                  <TableRow key={index} onClick={() => handleClick(item)}>
                                      <TableCell className="text-start">
                                          <div className="flex items-center">
                                              <Images.crypto
                                                  name={item.symbol.slice(0, -4)}
                                                  className="mr-2 rounded-full"
                                              />
                                              <div>
                                                  <div className="text-lg font-semibold">
                                                      {item.symbol.slice(0, -4)}
                                                  </div>
                                                  <div className="text-sm font-bold text-muted-foreground text-white">
                                                      ${item.price}
                                                  </div>
                                              </div>
                                          </div>
                                      </TableCell>
                                      {/* <TableCell className="text-center">
                                          <div>{item.update_time}</div>
                                      </TableCell> */}
                                      <TableCell className="text-center">
                                          <div>{item.target_time}</div>
                                      </TableCell>
                                      <TableCell className="text-end">
                                          <ChangeBadge percent={item.price_change} />
                                          <div>${item.prediction.toPrecision(6)}</div>
                                      </TableCell>
                                  </TableRow>
                              ))}
                    </TableBody>
                </Table>
            </div>
            <SheetComponent sheet={sheet} setSheet={onOpenChange} />
        </>
    );
}
