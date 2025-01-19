'use client';

import { MAIN_FONT } from "@/styles/font";
import { THEME } from "@/styles/theme";
import { assetHub, moonbaseAlpha, shibuyaTestnet } from "@/utils/chains";
import { darkTheme, getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { WagmiProvider } from "wagmi";

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'e6825efbac4ec8d3d193f905d80fc71d',
    chains: [moonbaseAlpha, shibuyaTestnet, assetHub]
});

const queryClient = new QueryClient();

export default function WalletProvider({ children }: {
    children: React.ReactNode;
}) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>

                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: THEME.PRIMARY_COLOR,
                        fontStack: MAIN_FONT.className,
                        borderRadius: 'small',
                    })}
                >
                    {children}
                </RainbowKitProvider>

            </QueryClientProvider>
        </WagmiProvider>
    );
}
