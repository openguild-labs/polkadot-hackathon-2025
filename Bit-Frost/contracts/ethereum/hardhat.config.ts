import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },

  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },

    sepolia : {
      url: "https://sepolia.infura.io/v3/979d8f8712b24030a953ed0607a54e76",
      chainId: 11155111,
      accounts: ["0x5f7db706280270794a122ea35d9c6b4ad7e5b0a75f70eee53e34e763970f178e" , "0x959e517449c189d836ebf838e62cf65ed7e23335b3aca037a9f4ccabb7cb8223"]
    },

    base : {
      url: "https://base-sepolia-rpc.publicnode.com",
      chainId: 84532,
      accounts: ["0x5f7db706280270794a122ea35d9c6b4ad7e5b0a75f70eee53e34e763970f178e" , "0x959e517449c189d836ebf838e62cf65ed7e23335b3aca037a9f4ccabb7cb8223"]
    },

    scroll : {
      url: "https://scroll-sepolia.chainstacklabs.com",
      chainId: 534351,
      accounts: ["0x5f7db706280270794a122ea35d9c6b4ad7e5b0a75f70eee53e34e763970f178e" , "0x959e517449c189d836ebf838e62cf65ed7e23335b3aca037a9f4ccabb7cb8223"]
    },

    Amoy : {
      url: "https://rpc.ankr.com/polygon_amoy",
      chainId: 80002,
      accounts: ["0x5f7db706280270794a122ea35d9c6b4ad7e5b0a75f70eee53e34e763970f178e" , "0x959e517449c189d836ebf838e62cf65ed7e23335b3aca037a9f4ccabb7cb8223"]
    },

    optimism : {
      url: "https://sepolia.optimism.io",
      chainId: 11155420,
      accounts: ["0x5f7db706280270794a122ea35d9c6b4ad7e5b0a75f70eee53e34e763970f178e" , "0x959e517449c189d836ebf838e62cf65ed7e23335b3aca037a9f4ccabb7cb8223"]
    },
    zkevm : {
      url: "https://rpc.cardona.zkevm-rpc.com",
      chainId: 2442,
      accounts: ["0x5f7db706280270794a122ea35d9c6b4ad7e5b0a75f70eee53e34e763970f178e" , "0x959e517449c189d836ebf838e62cf65ed7e23335b3aca037a9f4ccabb7cb8223"]
    },
    moonbase : {
      url : '	https://rpc.testnet.moonbeam.network',
      chainId: 1287,
      accounts: ["0x5f7db706280270794a122ea35d9c6b4ad7e5b0a75f70eee53e34e763970f178e" , "0x959e517449c189d836ebf838e62cf65ed7e23335b3aca037a9f4ccabb7cb8223"]
    },
    westend : {
      url : 'https://westend-asset-hub-eth-rpc.polkadot.io',
      chainId: 420420421,
      accounts: ["0x5f7db706280270794a122ea35d9c6b4ad7e5b0a75f70eee53e34e763970f178e" , "0x959e517449c189d836ebf838e62cf65ed7e23335b3aca037a9f4ccabb7cb8223"]
    },
    bnb : {
      url : 'https://bsc-testnet.blockpi.network/v1/rpc/public',
      chainId: 97,
      accounts: ["0x5f7db706280270794a122ea35d9c6b4ad7e5b0a75f70eee53e34e763970f178e" , "0x959e517449c189d836ebf838e62cf65ed7e23335b3aca037a9f4ccabb7cb8223"]
    },
    citrea : {
      url : 'https://rpc.testnet.citrea.xyz',
      chainId: 5115,
      accounts: ["0x5f7db706280270794a122ea35d9c6b4ad7e5b0a75f70eee53e34e763970f178e" , "0x959e517449c189d836ebf838e62cf65ed7e23335b3aca037a9f4ccabb7cb8223"]
    },
  },

  etherscan: {
    apiKey: {
      scrollSepolia: "H1U44AP9EQHUSH4JDA47GH1FKKVJATX5HW",
    },
    customChains: [
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://api-sepolia.scrollscan.com/api',
          browserURL: 'https://sepolia.scrollscan.com/',
        },
      },
    ],
  },


};

export default config;
