import { Sepolia, PolygonAmoyTestnet, BaseSepoliaTestnet, ScrollSepoliaTestnet, OpSepoliaTestnet, Chain, BinanceTestnet, MoonbaseAlpha  } from "@thirdweb-dev/chains";


// export const SERVER_API = 'https://be-8vhx.onrender.com/order/'
export const SERVER_API = 'http://localhost:8008/order/'


export const chains: Record<string, Chain> = {
    "evm:sepolia": Sepolia,
    "evm:amoy": PolygonAmoyTestnet,
    "evm:base": BaseSepoliaTestnet,
    "evm:scroll": ScrollSepoliaTestnet,
    "evm:optimism": OpSepoliaTestnet,
    "evm:bnb": BinanceTestnet,
    "evm:moonbase": MoonbaseAlpha,
    "evm:citrea" : {
        chain : "Citrea",
        chainId: 5115,
        rpc: ["https://rpc.testnet.citrea.xyz"],
        testnet: true,
        name: "citrea",
        nativeCurrency: {
            name: "cBTC",
            decimals: 8,
            symbol: "cBTC",
        },
        shortName: "citrea",
        slug: "citrea",
    }
    // "evm:linea" : LineaSepolia,
    // "evm:morph" : MorphHolesky,
    // "evm:flow" : Testnet,
    // "evm:hedera" : HederaTestnet,
    // "evm:airdao" : AirdaoTestnet,
};



export const vaultAddressMap: Record<string, string> = {
    'sepolia': '0x08b38a2db59582FE7927BC46cd6808dB0d00a467', // Token : 0xa0907fA317E90d6cE330d28565E040f0474E932E
    'base': '0x638d492d8ebbBD286a9fba909580E54f57CA750C', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
    'amoy': '0xd9127c88eC7F508DA6248827b41Deda09E85A284', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
    'optimism': '0x8E53eF2Cf6800E209EABf1AC3a8383d16140D029', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D  
    'bnb' : '0x21BaCd0133C09baC8E29550c4BB3F1072F753CDA', // Token : 0x8478C8835EAba59ae934cfb3fe20D3D387f33F9C 
    'moonbase' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f',
    'citrea' : '0x380d4823c2EB326294Cf465a189354792Fe36FC7'
    // 'hedera' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
    // 'flow' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
    // 'morph' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
    // 'linea' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
    // 'airdao' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
}

export const tokenAddressMap: Record<string, string> = {
    'sepolia': '0x1C353Ac2689f5f9449dC7122F8ac5016753ac86F', // Token : 0xa0907fA317E90d6cE330d28565E040f0474E932E
    'base': '0x7791C12280BF1e2F02ab67B90caF9c6c4464cb29', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
    'amoy': '0xe62b0fFE37D5b3C6C8c40Ec59C7025884987a174', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
    'optimism': '0x5563e709fB9F382Ffdad188ECF5968b98AA1669d', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
    'bnb' : '0x8478C8835EAba59ae934cfb3fe20D3D387f33F9C',  
    'moonbase' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D',
    'citrea' : '0xB6b85F1EbE9DAc55643FDAAF55b27519502c8a83'
    // 'hedera' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
    // 'flow' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
    // 'morph' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
    // 'linea' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
    // 'airdao' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
}