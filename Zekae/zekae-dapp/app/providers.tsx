'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { defineChain } from 'viem';
import { moonbaseAlpha, kairos } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http, createConfig } from 'wagmi';
import { Provider as JotaiProvider } from 'jotai';


export const assetHubWestend = defineChain({
  id: 420420421,
  name: "Asset-Hub Westend Testnet",
  nativeCurrency: {
    decimals: 18,
    name: 'Westend',
    symbol: 'WND',
  },
  rpcUrls: {
    default: {
      http: ['https://westend-asset-hub-eth-rpc.polkadot.io'],
      webSocket: ['wss://westend-asset-hub-eth-rpc.polkadot.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://assethub-westend.subscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0x5545dec97cb957e83d3e6a1e82fabfacf9764cf1',
      blockCreated: 10174702,
    },
  },
})

export const localConfig = createConfig({
  chains: [
    assetHubWestend,
    moonbaseAlpha,
    kairos
  ],
  transports: {
    [assetHubWestend.id]: http(),
    [moonbaseAlpha.id]: http(),
    [kairos.id]: http(),
  },
  ssr: true,
});

const { wallets } = getDefaultWallets();
// initialize and destructure wallets object

const config = getDefaultConfig({
  appName: "ZeKae", // Name your app
  projectId: "3b7376a7eef2fae6c3e21a1d438c9f14", // Enter your WalletConnect Project ID here
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [
    assetHubWestend,
    moonbaseAlpha,
    kairos
  ],
  transports: {
    [assetHubWestend.id]: http(),
    [moonbaseAlpha.id]: http(),
    [kairos.id]: http(),
  },
  ssr: true, // Because it is Nextjs's App router, you need to declare ssr as true
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </JotaiProvider>
  );
}
