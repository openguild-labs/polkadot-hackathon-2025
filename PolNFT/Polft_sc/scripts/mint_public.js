const hre = require("hardhat");
const {ethers, upgrades} = require("hardhat");

async function main() {
    // let USDT = await hre.ethers.getContractAt("Usdt","0x12542D22D3B68aefA34eb9e69cE89D2277fe42d3");
    // let  tx = await USDT.mint('1000000000000000000000000000000');
    // console.log(tx)



}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
