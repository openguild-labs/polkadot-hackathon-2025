"use client";

import useTicker from '@/hooks/useTicker';
import { formatNumber } from '@/utils/format';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
// import Onboard from './Guideline/Onboard';

const Guideline = dynamic(() => import('@/components/BuyCover/Guideline'), { ssr: false });
const Onboard = dynamic(() => import('@/components/BuyCover/Guideline/Onboard'), { ssr: false });
const Terminology = dynamic(() => import('@/components/BuyCover/Guideline/Terminology'), { ssr: false });

const Introduction = () => {
    const { symbol } = useParams();

    const ticker = useTicker(symbol as string);
    const value: number = Number(ticker?.lastPrice) ?? 0;

    const title = useMemo(() => `${formatNumber(value)} | ${(symbol as string).substring(0, symbol.indexOf(symbol.slice(-4).toString()))}/${symbol.slice(-4)} | Hakifi insurance`, [value, symbol]);

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {/* <GlossaryModal visible={showModal} onClose={() => setShowModal(false)} /> */}
            <Guideline />
            <Onboard />
            <Terminology />
        </>
    );
};

export default Introduction;
