import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { defineChain } from 'viem'

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const Acient8Sepolia = defineChain({
  id: 28122024,
  name: 'Acient8 Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Acient8 Sepolia',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://rpcv2-testnet.ancient8.gg'] },
  },
  blockExplorers: {
    default: {
      name: 'Acient8 Sepolia Explorer',
      url: 'https://ancient8.testnet.routescan.io',
      apiUrl: 'https://ancient8.testnet.routescan.io/api',
    },
  },
  contracts: {
  },
});

// Create wagmiConfig
const chains = [Acient8Sepolia]
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})