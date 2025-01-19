'use client';
// import { Icons } from '@/components/common/icons';

import { useEffect, useState } from 'react';

import { HeatMapChart } from '../heatmap-chart';
import RsiFilter from '../filter';
import { TopOverSold } from '../top-over-sold';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopOverBought } from '../top-over-bought';
import { CryptoData } from '@/models';
import { getLastestPrice } from '@/services';
import Loading from '@/components/common/loading';
import CryptoCard from '@/components/app/home/components/crypto-card';

export default function HeatMapIndicator() {
    const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getLastestPrice();
                const filteredData = data.map((item: CryptoData) =>
                    item.symbol === 'BTCUSDT' ? item : null,
                );
                setCryptoData(filteredData.filter((item): item is CryptoData => item !== null));
            } catch (error) {
                console.error('Failed to fetch data', error);
                setCryptoData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <Loading />;

    return (
        <div className="mx-auto max-w-md bg-gradient-to-b from-[#011225] to-[#000] pb-10 text-foreground">
            <div className="px-4 pt-10">
                {cryptoData.map((item: CryptoData, index: number) => (
                    <CryptoCard key={index} item={item} />
                ))}
            </div>

            <div className="m-4 grid grid-cols-2 items-center p-2">
                <p className="pl-2 text-sm font-bold text-white">Select analysis indicators</p>
                <RsiFilter />
            </div>
            <div className="mx-4">
                <div className="flex h-full items-center justify-around rounded-xl bg-black pb-4">
                    <HeatMapChart />
                </div>
                <div className="mt-5 flex h-full items-center justify-around rounded-xl bg-black py-4 text-white">
                    <Tabs defaultValue="tos" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-transparent p-1">
                            <TabsTrigger
                                value="tos"
                                className="group relative rounded-lg text-white transition-all data-[state=active]:bg-black data-[state=active]:shadow-md"
                            >
                                <div className="flex flex-col items-center justify-center py-2">
                                    <span className="text-lg font-bold text-white transition-colors group-data-[state=active]:text-[#01B792]">
                                        Top Over Sold
                                    </span>
                                    <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-[#1a741d] transition-transform duration-300 ease-out group-data-[state=active]:scale-x-100"></span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="tob"
                                className="group relative rounded-lg transition-all data-[state=active]:bg-black data-[state=active]:shadow-md"
                            >
                                <div className="flex flex-col items-center justify-center py-2">
                                    <span className="text-lg font-bold text-white transition-colors group-data-[state=active]:text-[#cc0001]">
                                        Top Over Bought
                                    </span>
                                    <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-[#CC0001] transition-transform duration-300 ease-out group-data-[state=active]:scale-x-100"></span>
                                </div>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="tos">
                            <TopOverSold />
                        </TabsContent>
                        <TabsContent value="tob">
                            <TopOverBought />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
