'use client';
import React from 'react';
import ThemeProvider from './theme-provider';
import ContextProvider from '@/contexts';
export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <ContextProvider>{children}</ContextProvider>
            </ThemeProvider>
        </>
    );
}
