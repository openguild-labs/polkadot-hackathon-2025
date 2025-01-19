'use client';

import { getPredictionsValidateTotalSummary } from '@/services';

import Image from 'next/image';

import heroBanner from '@/public/img/hero-banner.svg';
import { useEffect, useState } from 'react';
import { AIPrediction } from '@/types';

export default function HeroBanner() {
    const [stats, setStats] = useState<AIPrediction | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPredictionsValidateTotalSummary();
            setStats({
                allTrades: data.allTrades,
                highestProfitRate: data.highestProfitRate,
                lowestProfitRate: data.lowestProfitRate,
                winTrades: data.winTrades,
                loseTrades: data.loseTrades,
            });
        };

        fetchData();
    }, []);

    const formatNumber = (num: number) => num.toFixed(2);

    const statsData = [
        {
            label: 'LOSS RATE',
            value: `${formatNumber(((stats?.loseTrades ?? 0) / (stats?.allTrades ?? 1)) * 100)}%`,
            position: 'top-10 left-10',
            color: 'text-red-500',
            gradient: 'bg-gradient-to-r p-3 from-red-500/50 to-transparent',
        },
        {
            label: 'HIGHEST LOSS',
            value: `${formatNumber(stats?.lowestProfitRate ?? 0)}%`,
            position: 'bottom-10 left-10',
            color: 'text-blue-500',
            gradient: 'bg-gradient-to-r p-3 from-blue-400/50 to-transparent',
        },
        {
            label: 'WIN RATE',
            value: `${formatNumber(((stats?.winTrades ?? 0) / (stats?.allTrades ?? 1)) * 100)}%`,
            position: 'top-10 right-10',
            color: 'text-green-500',
            gradient: 'bg-gradient-to-l p-3 from-green-500/50 to-transparent',
        },
        {
            label: 'HIGHEST GAIN',
            value: `${formatNumber(stats?.highestProfitRate ?? 0)}%`,
            position: 'bottom-10 right-10',
            color: 'text-blue-500',
            gradient: 'bg-gradient-to-l p-3 from-blue-400/50 to-transparent',
        },
        {
            label: 'ALL TRADES',
            value: `${stats?.allTrades ?? 0}`,
            position: 'inset-0 flex items-center justify-center',
            color: 'text-yellow-400',
            gradient: 'rounded-full',
        },
    ];

    return (
        <div className="relative h-60 rounded-2xl bg-gray-400/10">
            {stats && (
                <div>
                    {statsData.map((stat, index) => (
                        <div
                            key={index}
                            className={`absolute ${stat.position} ${stat.gradient} flex flex-col items-center justify-center rounded-lg p-2`}
                        >
                            <h1 className="text-sm text-gray-300">{stat.label}</h1>
                            <p className={`${stat.color} text-xl`}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
