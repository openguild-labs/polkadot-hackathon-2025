// import type { Chain } from "../src/types";

export const WestendAssetHub = {
  chain: "WestendAssetHub",
  chainId: 31337,
  explorers: [
    {
      name: "anvil",
      url: "http://localhost:8545",
      standard: "none",
      icon: {
        url: "ipfs://Qma2GfW5nQHuA7nGqdEfwaXPL63G9oTwRTQKaGTfjNtM2W",
        width: 400,
        height: 400,
        format: "png",
      },
    },
  ],
  faucets: [],
  features: [],
  icon: {
    url: "ipfs://Qmdvmx3p6gXBCLUMU1qivscaTNkT6h3URdhUTZCHLwKudg",
    width: 1000,
    height: 1000,
    format: "png",
  },
  infoURL: "http://localhost:8545",
  name: "Westend Asset Hub",
  nativeCurrency: {
    name: "WND",
    symbol: "WND",
    decimals: 0,
  },
  networkId: 31337,
  redFlags: [],
  rpc: ["http://localhost:8545"],
  shortName: "local",
  slug: "local",
  testnet: true,
};
// as const satisfies Chain;
