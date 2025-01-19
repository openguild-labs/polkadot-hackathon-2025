require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    bscTestnet: {
      url: process.env.BSC_TESTNET,
      accounts: [process.env.OWNER_PRIV_KEY],
    },
    westend: {
      url: process.env.WESTEND_TESTNET, // Dùng Polkadot.js để kết nối
      accounts: [process.env.OWNER_PRIV_KEY],
    },
  },
};
