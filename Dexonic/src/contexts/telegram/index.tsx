/* eslint-disable no-unused-vars */
'use client';

import { createContext } from 'react';
import React from 'react';

interface TelegramContextType {
    tg: WebApp;
    user: WebAppUser;
    tgString: string;
    isLoading: boolean;
    login: (userId: number) => boolean;
    removeTg: () => void;
}

const TelegramContext = createContext<TelegramContextType>(null!);

export const useTelegram = () => {
    const context = React.useContext(TelegramContext);
    if (context === undefined)
        throw new Error('wrap your application in <TelegramContext> to use useTelegram components');
    return context;
};
export default TelegramContext;
