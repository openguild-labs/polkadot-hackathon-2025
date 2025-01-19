'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// import { useTelegram } from '@/contexts/telegram';
// import { Icons } from '@/components/common/icons';
import { getLastestPrice } from '@/services';
import Loading from '@/components/common/loading';
import { CryptoData } from '@/models';
import { useEffect, useState } from 'react';
import CryptoCard from './components/crypto-card';
import CarouselCoin from './components/carousel';
import Image from 'next/image';

import notifications from '@/public/icons/header-card/notifications.svg';
import magnifier from '@/public/icons/header-card/magnifier.svg';

export default function HomePage() {
    // const { user } = useTelegram();
    const [prices, setPrices] = useState<CryptoData[]>([]);
    const [searchPrices, setSearchPrices] = useState<CryptoData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getLastestPrice();
                setPrices(data);
            } catch {
                setPrices([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <Loading />;
    const handleSearch = (e: { target: { value: string } }) => {
        setSearchPrices(
            prices.filter((item) => item.symbol.includes(e.target.value.toUpperCase())),
        );
    };
    const cryptoPrices = searchPrices.length > 0 ? searchPrices : prices;

    return (
        <div className="mx-auto max-w-md space-y-4 bg-black pb-10 text-foreground">
            <div className="rounded-b-3xl bg-neutral-500/20 px-4 py-5 md:px-8">
                <Card className="space-y-4 rounded-3xl bg-neutral-200/20 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Avatar>
                                {/* <AvatarImage src="/img/icon.png" alt={user.first_name} /> */}
                                {/* <AvatarFallback>{user.first_name}</AvatarFallback> */}
                            </Avatar>
                            <div>
                                {/* <h1 className="font-semibold">Hi, {user.first_name}</h1> */}
                                {/* <h1 className="text-white">Hi, Luke Nguyen</h1> */}
                                <h1 className="text-white">Hey! Fellow Traders</h1>
                                <p className="text-sm text-[#A09FA5] text-muted-foreground">
                                    Have a good day!
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            {/* <Icons.bell className="h-6 w-6" /> */}
                            <Image src={notifications} alt="notification" />
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </div>
                    <div className="relative w-full max-w-sm">
                        {/* <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /> */}
                        <Image
                            src={magnifier}
                            alt="magnifier"
                            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
                        />
                        <Input
                            type="search"
                            onChange={(value) => handleSearch(value)}
                            placeholder="Search for cryptocurrencies"
                            className="rounded-full bg-[#151515] py-6 pl-10 pr-4 text-white placeholder:text-[#8A8A8A]"
                        />
                    </div>
                </Card>
            </div>
            {/* <>
                <CarouselCoin />
            </> */}
            <div className="px-4 md:px-8">
                <div className="mb-6 ml-2 mt-7 text-center">
                    <h2 className="text-3xl font-semibold text-white">Market List</h2>
                </div>
                <div className="space-y-3">
                    {cryptoPrices.length > 0 &&
                        cryptoPrices.map((item: CryptoData, index: number) => (
                            <CryptoCard key={index} item={item} />
                        ))}
                </div>
            </div>
        </div>
    );
}
