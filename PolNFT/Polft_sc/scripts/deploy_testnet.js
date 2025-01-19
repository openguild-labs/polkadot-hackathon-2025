const hre = require("hardhat");
const {ethers, upgrades} = require("hardhat");

// const OWNER_ADDRESS = "0xb8e28e6187B30aA816816e399Bcc711835251E78";
// const FIXED_DAI_ADDRESS_ERC20 = "0xd555d9CF3fd5F0C5F806EF7B5D9236E04CF938EA";

async function main() {
    let data = {};
    const Whitelist = await hre.ethers.getContractFactory("Whitelist");
    const whitelistProxy = await upgrades.deployProxy(Whitelist, [], {
        kind: "uups",
    });
    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplaceProxy = await upgrades.deployProxy(
        Marketplace,
        [whitelistProxy.address],
        {
            kind: "uups",
        }
    );
    const Offer = await hre.ethers.getContractFactory("Offer");
    const offerProxy = await upgrades.deployProxy(
        Offer,
        [whitelistProxy.address],
        {
            kind: "uups",
        }
    );
    const Treasury = await hre.ethers.getContractFactory("Treasury");
    const treasuryProxy = await upgrades.deployProxy(
        Treasury,
        [whitelistProxy.address],
        {
            kind: "uups",
        }
    );
    const Polft721 = await hre.ethers.getContractFactory("Polft721");
    const Polft721Proxy = await upgrades.deployProxy(
        Polft721,
        [whitelistProxy.address],
        {
            kind: "uups",
        }
    );
    const Polft1155 = await hre.ethers.getContractFactory("Polft1155");
    const Polft1155Proxy = await upgrades.deployProxy(
        Polft1155,
        [whitelistProxy.address],
        {
            kind: "uups",
        }
    );

    const Currency = await hre.ethers.getContractFactory("Currency");
    const currencyProxy = await upgrades.deployProxy(
        Currency,
        [whitelistProxy.address],
        {
            kind: "uups",
        }
    );

    let tx;

    tx = await whitelistProxy.addGrantRole('0xA6cBf5d84c2A1032E6aB55DFdA4a4916A8D8aaf3');
    await tx.wait();

    // Offer setting
    tx = await offerProxy.setCurrencyAddress(currencyProxy.address);
    await tx.wait();
    tx = await offerProxy.setTreasuryAddress(treasuryProxy.address);
    await tx.wait();

    // Marketplace setting
    tx = await marketplaceProxy.setCurrencyAddress(currencyProxy.address);
    await tx.wait();
    tx = await marketplaceProxy.setTreasuryAddress(treasuryProxy.address);
    await tx.wait();


    /// Token Fee
    const TokenFee = await hre.ethers.getContractFactory("Usdt");
    const TokenFee_contract = await TokenFee.deploy();

    tx = await TokenFee_contract.mint('1000000000000000000000000000000');
    await tx.wait();


    tx = await currencyProxy.addCurrency(
        TokenFee_contract.address,
        "https://cdn.iconscout.com/icon/premium/png-512-thumb/binance-coin-bnb-7266775-5978349.png?f=avif&w=256"
    ); // Token_Fee Address
    await tx.wait();

    // Setting Polftnft
    tx = await Polft721Proxy.setContractURI(
        "http://ipfs/QmU5HWmp2g3qhJ2F3NqbvSzqqBJrLuFmZFRZNPhr5NrJqL"
    );
    await tx.wait();
    tx = await Polft1155Proxy.setContractURI(
        "http://ipfs/QmcSm65qpdPoSfUifT7uDskJhuMn85Fwbr41pAxCkrNeKt"
    );
    await tx.wait();

    // Deploy Rent Contract
    let PolftRentContract =  await hre.ethers.getContractFactory("PolftRent");
    let PolftRent = await PolftRentContract.deploy(whitelistProxy.address);

    await PolftRent.setCurrencyAddress(currencyProxy.address);

    await PolftRent.setTreasuryAddress(treasuryProxy.address);

    let PolftLendContract =  await hre.ethers.getContractFactory("PolftLend");
    let PolftLendProxy = await upgrades.deployProxy(
        PolftLendContract,
        [whitelistProxy.address],
        {
            kind: "uups",
        }
    )

    await PolftLendProxy.setCurrencyAddress(currencyProxy.address);

    data.marketplace = {
        address: marketplaceProxy.address,
        hash: marketplaceProxy.deployTransaction.hash,
        arguments: [],
    };
    data.offer = {
        address: offerProxy.address,
        hash: offerProxy.deployTransaction.hash,
        arguments: [],
    };
    data.Polft721 = {
        address: Polft721Proxy.address,
        hash: Polft721Proxy.deployTransaction.hash,
        arguments: [],
    };
    data.Polft1155 = {
        address: Polft1155Proxy.address,
        hash: Polft1155Proxy.deployTransaction.hash,
        arguments: [],
    };
    data.currency = {
        address: currencyProxy.address,
        hash: currencyProxy.deployTransaction.hash,
        arguments: [],
    };
    data.whitelist = {
        address: whitelistProxy.address,
        hash: whitelistProxy.deployTransaction.hash,
        arguments: [],
    };
    data.token = {
        address: TokenFee_contract.address,
        hash: TokenFee_contract.deployTransaction.hash,
    }
    data.PolftLend = {
        address: PolftLendProxy.address,
        hash: PolftLendProxy.deployTransaction.hash,
    }
    data.PoftRent = {
        address: PolftRent.address,
        hash: PolftRent.deployTransaction.hash,
    }

    console.log("Data", data);
    console.log(
        "--------------------------------------------------------------------------"
    );

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
// Data {
//     marketplace: {
//         address: '0xeB3165a3AC56Cc863f2Abd3F1f63a0F0b40aDc27',
//             hash: '0xbeb8bba56a3e7df053fe5a64cce82b95b2dc0a82ceecc4c81c50713df03ae206',
//             arguments: []
//     },
//     offer: {
//         address: '0x5B2B52B0Ac1B0806DDc14Dc89260E04C78f6231a',
//             hash: '0x7098e46d4e4696e187d9838ba94ae8c415af2ea011989eea3fa851f030701bcf',
//             arguments: []
//     },
//     Polft721: {
//         address: '0xF2ebC456e797b55967F91205137cf88D483df778',
//             hash: '0x3a54bf25123b563cd8e534bfe728dc0bc786457f15b2669dd3001fb285c96789',
//             arguments: []
//     },
//     Polft1155: {
//         address: '0x56879083fEde8C724Bbc13F32E8E94D3fb6377db',
//             hash: '0x24f5319a7153d9c815008e86221f4271931a039331ed1b07f176c777beb0c5a1',
//             arguments: []
//     },
//     currency: {
//         address: '0x6841120c66f14Be706A332E6A6Eb04187dc5C49c',
//             hash: '0x467d59ab32c32479c79a18d93e6a50bcfc701c71747403c054c010cb6abbbc3c',
//             arguments: []
//     },
//     whitelist: {
//         address: '0x3e73D9Db5f201359dD96Cb8950B011e8FEee1910',
//             hash: '0x974e80243a52556777eda415329d6f13f596f66afec754a1e0d9b6a42482b369',
//             arguments: []
//     },
//     token: {
//         address: '0x6efbF6a02ED04A7D6Db18bFFb926419cf4eb470A',
//             hash: '0xbf7fa685fed8c339da63cc6e740d4eaf78ce6fd8d0b270324ab03f904cb02248'
//     },
//     PolftLend: {
//         address: '0xfc9EA86Ab1D4299D87f5543276349d5f4AEAA552',
//             hash: '0xd74cfbbd169d474133abef865336d6e269fa97aa5675824154c2f9dd46dc3376'
//     },
//     PoftRent: {
//         address: '0x77E1099D545534A93b333C054D37F9785176D765',
//             hash: '0x91a223ac6640877045716220d2014eda3d48995c05b3f7a8fbd56ebb0d70a676'
//     }
// }
// --------------------------------------------------------------------------

