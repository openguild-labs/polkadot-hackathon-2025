'use client';
import React from 'react';
import TelegramProvider from '@/contexts/telegram/provider';
// import GenericProvider from './telegram/provider';

const ContextProvider = function ({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TelegramProvider>{children}</TelegramProvider>
        </>
    );
};

export default ContextProvider;
