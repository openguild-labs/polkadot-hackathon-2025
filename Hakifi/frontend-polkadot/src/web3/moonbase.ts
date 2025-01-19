import { defineChain } from "viem";

export const MoonbaseAlpha = /*#__PURE__*/ defineChain({
    id: 1287,
    name: 'Moonbase Alpha Chain',
    network: 'moonbase-alpha',
    nativeCurrency: {
      decimals: 18,
      name: 'DEV',
      symbol: 'DEV',
    },
    rpcUrls: {
      default: { http: ['https://rpc.api.moonbase.moonbeam.network'] },
      public: { http: ['https://rpc.api.moonbase.moonbeam.network'] },
    },
    blockExplorers: {
      etherscan: { name: 'MoonScan', url: 'https://moonbase.moonscan.io/' },
      default: { name: 'MoonScan', url: 'https://moonbase.moonscan.io/' },
    },
    testnet: true,
})

  