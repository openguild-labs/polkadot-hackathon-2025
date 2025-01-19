'use client';

import Image from 'next/image';
import Link from 'next/link';

import banner from '@/public/img/heatmap-banner.svg';

export default function Banner() {
    return (
        <div className="justify-center">
            <p className="mb-3 ml-6 text-white">Single Indicator</p>
            <Link href={'/analysis/heatmap'}>
                <Image
                    src={banner}
                    alt="banner"
                    width={400}
                    className="justify-self-center rounded-xl"
                />
            </Link>
        </div>
    );
}
