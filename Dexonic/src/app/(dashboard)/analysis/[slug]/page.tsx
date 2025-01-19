import { notFound } from 'next/navigation';
import Heatmap from '@/components/app/analysis/components/indicators/heatmap';
import ADX from '@/components/app/analysis/components/indicators/adx';
import JP_Candlestick from '@/components/app/analysis/components/indicators/jp-candlestick';
import PSAR from '@/components/app/analysis/components/indicators/psar';

const indicators: { [key: string]: React.ComponentType } = {
    heatmap: Heatmap,
    adx: ADX,
    'jp-candlestick': JP_Candlestick,
    psar: PSAR,
};

export default function IndicatorPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    const IndicatorComponent: React.ComponentType | undefined = indicators[slug];

    if (!IndicatorComponent) {
        notFound();
    }

    return (
        <div className="mx-auto h-full max-w-md p-4">
            <IndicatorComponent />
        </div>
    );
}
