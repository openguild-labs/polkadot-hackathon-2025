import { notFound } from 'next/navigation';

import Profile from '@/components/app/more/components/profile';
import FAQ from '@/components/app/more/components/faq';
import Chatbot from '@/components/app/more/components/chatbot';

const features: { [key: string]: React.ComponentType } = {
    profile: Profile,
    faq: FAQ,
    chatbot: Chatbot,
};

export default function IndicatorPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    const IndicatorComponent: React.ComponentType | undefined = features[slug];

    if (!IndicatorComponent) {
        notFound();
    }

    return (
        <div className="mx-auto h-full max-w-md p-4">
            <IndicatorComponent />
        </div>
    );
}
