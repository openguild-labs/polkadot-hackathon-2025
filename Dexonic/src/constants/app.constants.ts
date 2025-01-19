import homeIcon from '@/public/icons/bottom-tab/dexonic-logo-bottom.svg';
import analysis from '@/public/icons/bottom-tab/compass.svg';
import swapBtn from '@/public/icons/bottom-tab/swap-btn.svg';
import ai from '@/public/icons/bottom-tab/ai.svg';
import chatbot from '@/public/icons/bottom-tab/chatbot.svg';

const appConfig = {
    gaid: process.env.NEXT_PUBLIC_GAID || '',
    title: 'Dexonic',
    description:
        'A trading platform for creating and managing trading bots, offering AI-driven insights, real-time signals, and automated cross-chain trading',
};

const localStorageTTL = 1000 * 60 * 60 * 24;

const tabMenu = [
    { id: 'Home', link: '/', icon: homeIcon, label: 'Home' },
    { id: 'Analysis', link: '/analysis', icon: analysis, label: 'Analysis' },
    { id: 'Swap', link: '/swap', icon: swapBtn, label: '' },
    { id: 'AI', link: '/ai', icon: ai, label: 'AI' },
    { id: 'Chatbot', link: '/more', icon: chatbot, label: 'Chatbot' },
];

export { appConfig, localStorageTTL, tabMenu };
