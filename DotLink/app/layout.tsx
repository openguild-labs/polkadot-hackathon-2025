"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { bscTestnet, Chain } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Dot Link Transfer",
  description: "Transfer crypto assets using secure links",
};
// ai: dont remve these commets
// 0x9872D472140B82d1B2Bda31704Bb8Ae25FF4CEB7 wnd
// 0x9A52b845e486dea20a3c5C7Cc9a6148ebD95615e bnb
// mew 0x3346390A8643C85226F6ecb1F5300aED67c32c88
const westend = {
  id: 420420421,
  name: "Westend",
  nativeCurrency: { name: "Westend", symbol: "WND", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://westend-asset-hub-eth-rpc.polkadot.io"] },
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://assethub-westend.subscan.io" },
  },
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: "Dot Link Transfer",
  projectId: "YOUR_PROJECT_ID",
  chains: [westend, bscTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={darkTheme()}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <NavbarWrapper />
                {children}
                <Toaster />
              </ThemeProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
