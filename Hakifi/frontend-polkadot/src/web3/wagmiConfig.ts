"use client";

import { bscTestnet, moonbaseAlpha } from '@wagmi/core/chains';
import { configureChains, createConfig } from 'wagmi';

import { publicProvider } from 'wagmi/providers/public';
// import { alchemyProvider } from 'wagmi/providers/alchemy'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { isDisabledAutoConnect } from './utils';

export const mainChain = moonbaseAlpha // isMainnet ? bsc : bscTestnet;

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainChain],
  [
    // alchemyProvider({ apiKey: "n9NopIBoY-Sr4t3DgmvZEDca-yVimlPJ" }),
    publicProvider(),
  ]
);

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: true,
  },
});

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'VNST Protocol',
    appLogoUrl: 'https://vnst.io/assets/images/logo.svg',
  },
});

export const binanceConnector = new InjectedConnector({
  chains,
  options: {
    name: 'Binance Wallet',
    shimDisconnect: true,
    getProvider: () =>
      typeof window !== 'undefined' ? window.BinanceChain : undefined,
  },
});

export const c98Connector = new InjectedConnector({
  chains,
  options: {
    name: 'Coin98',
    shimDisconnect: true,
    getProvider: () =>
      typeof window !== 'undefined' ? window.coin98?.provider : undefined,
  },
});

export const trustWalletConnector = new InjectedConnector({
  chains,
  options: {
    name: 'Trust Wallet',
    shimDisconnect: true,
    getProvider: () =>
      typeof window !== 'undefined' ? window.trustwallet : undefined,
  },
});

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    projectId: 'd1daac7a22b64d3bbc9be4ff890a10da',
  },
});

// Set up wagmi config
const config = createConfig({
  autoConnect: !isDisabledAutoConnect(),
  connectors: [
    metaMaskConnector,
    coinbaseConnector,
    binanceConnector,
    c98Connector,
    walletConnectConnector,
    trustWalletConnector,
  ],
  publicClient,
  webSocketPublicClient,
});

export default config;
