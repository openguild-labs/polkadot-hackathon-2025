import { Chain } from "wagmi/chains";

export const moonbaseAlpha = {
    id: 1287,
    name: 'Moonbase Alpha',
    iconUrl: 'https://moonbase.moonscan.io/assets/moonbase/images/svg/logos/chain-light.svg?v=24.12.4.2',
    // iconBackground: '#fff',
    nativeCurrency: { name: 'DEV', symbol: 'DEV', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc.api.moonbase.moonbeam.network'] },
    },
    blockExplorers: {
        default: { name: 'Moonscan', url: 'https://moonbase.moonscan.io' },
    },
    // contracts: {
    //   multicall3: {
    //     address: '0xca11bde05977b3631167028862be2a173976ca11',
    //     blockCreated: 11_907_934,
    //   },
    // },
} as const satisfies Chain;

export const shibuyaTestnet = {
    id: 81,
    name: 'Shibuya Testnet EVM',
    iconUrl: 'https://astar.subscan.io/_next/image?url=%2Fchains%2Fastar%2Flogo-mini.png&w=256&q=75',
    // iconBackground: '#fff',
    nativeCurrency: { name: 'Shibuya', symbol: 'SBY', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://evm.shibuya.astar.network'] },
    },
    blockExplorers: {
        default: { name: 'Shibuya scan', url: 'https://blockscout.com/shibuya' },
    },
    // contracts: {
    //   multicall3: {
    //     address: '0xca11bde05977b3631167028862be2a173976ca11',
    //     blockCreated: 11_907_934,
    //   },
    // },
} as const satisfies Chain;

export const assetHub = {
    id: 420420421,
    name: 'Asset-Hub Westend Testnet',
    iconUrl: '/images/assethub-logo.png',
    // iconBackground: '#fff',
    nativeCurrency: { name: 'WND', symbol: 'WND', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://westend-asset-hub-eth-rpc.polkadot.io'] },
    },
    blockExplorers: {
        default: { name: 'Asset-Hub scan', url: 'https://assethub-westend.subscan.io' },
    },
    // contracts: {
    //   multicall3: {
    //     address: '0xca11bde05977b3631167028862be2a173976ca11',
    //     blockCreated: 11_907_934,
    //   },
    // },
} as const satisfies Chain;
