'use client';

import Image from 'next/image';

import rsiJPC from '@/public/icons/confluence/rst&jpc.svg';
import radar from '@/public/icons/confluence/radar.svg';

export default function Confluence() {
    return (
        <div className="mt-7 font-bold text-white">
            <h1 className="mb-3 ml-6">Confluence</h1>
            <div className="mx-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg border-[2px] border-[#282828] p-4 pb-6 text-sm">
                    <h1 className="mb-2">2 Indicators</h1>
                    <span className="inline-flex flex-col items-center space-y-2">
                        <Image src={rsiJPC} alt="RSI & JPC" width={50} />
                        <p>RSI&JPC</p>
                    </span>
                </div>
                <div className="rounded-lg border-[2px] border-[#282828] p-4 text-sm">
                    <h1 className="mb-2">Multiple Indicators</h1>
                    <span className="inline-flex flex-col items-center space-y-2">
                        <Image src={radar} alt="Radar" width={50} />
                        <p className="text-center">Radar</p>
                    </span>
                </div>
            </div>
        </div>
    );
}
