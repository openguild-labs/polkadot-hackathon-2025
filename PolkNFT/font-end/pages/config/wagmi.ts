import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage, http } from "wagmi";
import { mainnet, bscTestnet, sepolia, moonbaseAlpha } from "wagmi/chains";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const westendTestnet = {
  id: 1287,
  name: "Westend Testnet",
  nativeCurrency: { name: "Westend", symbol: "WND", decimals: 18 },
  rpcUrls: {
    default: { http: ["westend-asset-hub-eth-rpc.polkadot.io"] },
  },
  blockExplorers: {
    default: { name: "Subscan", url: "assethub-westend.subscan.io" },
  },
};

const metadata = {
  name: "DegisticData",
  description: "Decentralized data storage methods",
  url: "", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, sepolia, moonbaseAlpha], // required
  projectId, // required
  metadata, // required
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [moonbaseAlpha.id]: http(),
    // [westendTestnet.id]: http("https://westend-asset-hub-eth-rpc.polkadot.io"),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
});
