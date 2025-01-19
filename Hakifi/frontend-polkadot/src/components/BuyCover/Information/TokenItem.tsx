import { MarketPair } from '@/@type/pair.type';
import { Skeleton } from '@/components/common/Skeleton';
import { Ticker, useTickerSocket } from '@/hooks/useTickerSocket';
import { cn } from '@/utils';
import { formatNumber } from '@/utils/format';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type FavoriteItemProps = {
    pair: MarketPair;
};

const TokenItem = ({ pair }: FavoriteItemProps) => {
    const [ticker, setTicker] = useState<Ticker | null>(null);

    useTickerSocket(pair.symbol, setTicker);
    const value: number = Number(ticker?.lastPrice) ?? 0;

    const priceChangePercent = useMemo(
        () => ticker?.priceChangePercent,
        [ticker],
    );
    const negative = useMemo(
        () => (priceChangePercent || 0) < 0,
        [priceChangePercent],
    );

    return (
        <section key={pair.id} className="py-2.5 lg:px-4 flex items-center gap-6 justify-between hover:bg-background-quaternary">
            <Link href={`/buy-cover/${pair.symbol}`}>
                <section className="max-w-[150px] flex items-center gap-2 text-body-14">
                    <Image
                        src={pair.token.attachment}
                        width={20}
                        height={20}
                        alt="logo"
                        className="rounded-full"
                    />
                    <div className="flex items-center gap-1">
                        <span className="text-typo-primary">{pair.asset} </span>
                        <span className="text-typo-secondary flex whitespace-nowrap">/ {pair.unit}</span>
                    </div>
                </section>
            </Link>
            <section className="flex items-center gap-8">
                {value ?
                    <div className={cn("w-[90px] !text-body-14 text-right", !negative ? 'text-positive' : 'text-negative')}>{value}</div> :
                    <Skeleton className="h-5 w-[90px] text-right" />
                }
                {priceChangePercent ?
                    <div className={cn("w-[90px] !text-body-14 text-right", !negative ? 'text-positive' : 'text-negative',)}>
                        {negative ? '-' : '+'}
                        {priceChangePercent
                            ? formatNumber(Math.abs(priceChangePercent), 2)
                            : '-'}
                        %
                    </div> :
                    <Skeleton className="h-5 w-[90px] text-right" />
                }
            </section>
        </section>
    );
};

export default TokenItem;