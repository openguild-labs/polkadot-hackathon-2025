import { PropsWithChildren, useEffect, useState } from 'react';
import TelegramContext from '@/contexts/telegram';

const TelegramProvider = function ({ children }: PropsWithChildren) {
    const [tg, setTg] = useState<WebApp>(null!);
    const [user, setUser] = useState<WebAppUser>(null!);
    const [tgString, setTgString] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        const initTg = async () => {
            setIsLoading(true);
            if (
                typeof window !== 'undefined' &&
                window.Telegram &&
                window.Telegram.WebApp &&
                window.Telegram.WebApp.initData != ''
            ) {
                const telegramInstance: WebApp = window.Telegram.WebApp;
                setTg(telegramInstance);
                setTgString(telegramInstance.initData || '');
                setUser(telegramInstance.initDataUnsafe.user || null!);
                setIsLoading(false);
            } else {
                timer = setTimeout(initTg, 250);
            }
        };
        initTg();
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, []);

    const login = (userId: number): boolean => {
        try {
            localStorage.setItem('t-user', JSON.stringify(userId));
        } catch {
            return false;
        }
        return true;
    };

    const removeTg = () => {
        setTg(null!);
        localStorage.removeItem('t-user');
    };

    return (
        <TelegramContext.Provider value={{ tg, user, tgString, isLoading, login, removeTg }}>
            {children}
        </TelegramContext.Provider>
    );
};

export default TelegramProvider;
