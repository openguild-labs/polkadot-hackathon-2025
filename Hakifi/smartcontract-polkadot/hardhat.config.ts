import "solidity-docgen"
import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@openzeppelin/hardhat-upgrades"

import "dotenv/config"

const config: HardhatUserConfig = {
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [process.env.TESTNETKEY as string],
    },
    westend: {
      url: `https://westend-asset-hub-eth-rpc.polkadot.io`,
      chainId: 420420421,
      accounts: [process.env.TESTNETKEY as string],
    }
  },
  etherscan: {
    apiKey: {
      westendTestnet: "",
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 40000,
  },
}

export default config
