const hre = require("hardhat");
const {ethers, upgrades} = require("hardhat");
async function main() {



    const mock721Contract = await hre.ethers.getContractFactory("ERC721Mock");
    const mock721 =  await mock721Contract.deploy();



    for (let i = 0; i < 10; i++) {
          await mock721.safeMint('0xA6cBf5d84c2A1032E6aB55DFdA4a4916A8D8aaf3','https://silver-obedient-kangaroo-214.mypinata.cloud/ipfs/bafkreiensdvoxqkzsup2kcjyicpdxgiuqwiwox35fonh4disdo2umtzj7i')
    }

    console.log(mock721.address);

}


0x694A9796431573D441441180056d2CA76a3579d9


main()