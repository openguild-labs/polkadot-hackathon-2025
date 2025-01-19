import { Connector } from 'wagmi';
import { browserName } from 'react-device-detect';
import {
  coinbaseConnector,
  metaMaskConnector,
  binanceConnector,
  c98Connector,
  walletConnectConnector,
  trustWalletConnector,
} from './wagmiConfig';

export type WalletConfig = {
  id: string;
  connector: Connector;
  installHref?: string;
};

export enum WalletIds {
  Metamask = 'metamask',
  Coinbase = 'coinbase',
  Binance = 'binance',
  C98 = 'c98',
  WalletConnect = 'wallet-connect',
  TrustWallet = 'trust-wallet',
}

export const isWalletBrowserSupported = [
  'Opera',
  'Chrome',
  'Brave',
  'Edge',
  'Firefox',
].includes(browserName);

const wallets: WalletConfig[] = [
  {
    id: WalletIds.Metamask,
    connector: metaMaskConnector,
    installHref: 'https://metamask.io/download/',
  },
  {
    id: WalletIds.Coinbase,
    connector: coinbaseConnector,
    installHref: 'https://www.coinbase.com/wallet/downloads',
  },
  {
    id: WalletIds.Binance,
    connector: binanceConnector,
    installHref: 'https://chromewebstore.google.com/detail/bnb-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp'
  },
  {
    id: WalletIds.C98,
    connector: c98Connector,
    installHref:
      'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
  },
  {
    id: WalletIds.WalletConnect,
    connector: walletConnectConnector,
  },
  {
    id: WalletIds.TrustWallet,
    connector: trustWalletConnector,
    installHref: 'https://trustwallet.com/download/',
  },
];

export const walletLogos = {
  [metaMaskConnector.name]: '/assets/images/wallets/metamask.svg',
  [coinbaseConnector.name]: '/assets/images/wallets/coinbase.svg',
  [binanceConnector.name]: '/assets/images/wallets/binance.svg',
  [c98Connector.name]: '/assets/images/wallets/c98.svg',
  [walletConnectConnector.name]: '/assets/images/wallets/walletconnect.svg',
  [trustWalletConnector.name]: '/assets/images/wallets/trustwallet.svg',
};

export default wallets;
