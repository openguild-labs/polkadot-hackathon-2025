'use client';

import Link from 'next/link';
import Image from 'next/image';

import heatmap from '@/public/icons/indicator/heatmap.svg';
import jpCandlestick from '@/public/icons/indicator/jp-candlestick.svg';
import psar from '@/public/icons/indicator/psar.svg';
import adx from '@/public/icons/indicator/adx.svg';

const indicators = [
    { name: 'Heatmap', icon: heatmap, href: 'heatmap' },
    { name: 'Candlestick', icon: jpCandlestick, href: 'jp-candlestick' },
    { name: 'PSAR', icon: psar, href: 'psar' },
    { name: 'ADX', icon: adx, href: 'adx' },
];

export default function IndicatorList() {
    return (
        <div className="mt-4 flex justify-center">
            <div className="text-white">
                <ul className="grid grid-cols-4 items-center justify-center gap-4 rounded-lg border-[2px] border-[#282828] px-8 py-5">
                    {indicators.map((indicator, index) => (
                        <li key={index} className="flex flex-col items-center">
                            <Link href={`/analysis/${indicator.href}`}>
                                <Image
                                    src={indicator.icon}
                                    alt={indicator.name}
                                    width={50}
                                    height={50}
                                    className="cursor-pointer"
                                />
                            </Link>
                            <span className="text-sm">{indicator.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
