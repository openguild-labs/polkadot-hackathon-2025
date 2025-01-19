import axios from "axios";
import { regtest, testnet } from "bitcoinjs-lib/src/networks.js";


/// ------------------ DEVNET CONSTS ------------------- ///


export const  blockstream = new axios.Axios({
    baseURL: `https://blockstream.info/testnet/api`
});

export const network = testnet

// export const eth_api = "https://sepolia.infura.io/v3/979d8f8712b24030a953ed0607a54e76";

export const eth_priv_key = process.env.ETH_PRIV_KEY?.trim(); // my metamask

export const bitcoin_priv_key = process.env.BTC_PRIV_KEY?.trim(); // bcrt1pc0zptvp9gra44p2drp2ttvzm95wrc64l82qwummegsd7glw8arfs7n65cl , tb1pua8vc6vmpffcprdhfgpu7h6rr8gyhuvanpak6m97tgdzzg0kpg4qel0kdv

// should be updated after executor is deployed
export const eth_agg_key = "0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305";

const vaultAddressMap : Record<string, string> = {
    'sepolia': '0xAe5a73661222DdC593CC987C186801B45072014b', // Token : 0xa0907fA317E90d6cE330d28565E040f0474E932E
    'base' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
    'scroll' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
    'amoy' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
    'optimism' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
    'hedera' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
    'flow' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
    'morph' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
    'linea' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
    'airdao' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
    'rootstock' : '0xF32F7f79877E4ccB9f72B7303b45372b031a7483', // Token : 0x55Bf362782A87E5Ed46F59561B3Bb60B83eBAC9f   
    'gnosis' : '0x30Da5Aa64C7Eb218102BFEAeE8069d73711caf0e'
}

const rpcMap : Record<string, string> = {
    'sepolia': 'https://sepolia.infura.io/v3/979d8f8712b24030a953ed0607a54e76',
    'base' : 'https://base-sepolia-rpc.publicnode.com',
    'scroll' : 'https://rpc.ankr.com/scroll_sepolia_testnet',
    'amoy' : "https://rpc.ankr.com/polygon_amoy",
    'optimism' : "https://sepolia.optimism.io",
    'hedera' : 'https://testnet.hashio.io/api', 
    'flow' : 'https://testnet.evm.nodes.onflow.org', 
    'morph' : 'https://rpc-quicknode-holesky.morphl2.io',  
    'linea' : 'https://rpc.sepolia.linea.build', 
    'airdao' : 'https://network.ambrosus-test.io',
    'rootstock' : 'https://mycrypto.testnet.rsk.co',
    'gnosis' : 'https://gnosis-chiado-rpc.publicnode.com'
}



//// -------------------- LOCALTEST CONST -------------- ////

// // mempool if testnet
// // else regtest
// export const  blockstream = new axios.Axios({
//     baseURL: `http://localhost:3000`,
//     // baseURL: `https://blockstream.info/testnet/api`
// });

// export const network = regtest

// // eth rpc

// export const eth_priv_key = "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e";

// // NOTE: Fund this address bcrt1pc0zptvp9gra44p2drp2ttvzm95wrc64l82qwummegsd7glw8arfs7n65cl if regtest
// export const bitcoin_priv_key = "KwTAyd4mvEvGf7ETrYW2UqMLXLzXNyTgZWFoJLtchPuRkH6jhXuf"; // bcrt1pc0zptvp9gra44p2drp2ttvzm95wrc64l82qwummegsd7glw8arfs7n65cl , tb1pua8vc6vmpffcprdhfgpu7h6rr8gyhuvanpak6m97tgdzzg0kpg4qel0kdv

// // should be updated after executor is deployed
// export const eth_agg_key = "0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305";


// export const tokenAddress = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";


// const vaultAddressMap : Record<string, string> = {
//     'ethereum': '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
//     'sepolia' : '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
// }

// const rpcMap : Record<string, string> = {
//     'ethereum': 'http://127.0.0.1:8545/',
//     'sepolia' : 'http://127.0.0.1:8545/'
// }



// ---  global 
export function vaultAddress(chain : string) {
    if (vaultAddressMap[chain]) {
        return vaultAddressMap[chain];
    }
    console.log(`vaultAddress not found for ${chain}`);
    return '';
    
}
export function eth_api(chain : string) {
    if (rpcMap[chain]) {
        return rpcMap[chain];
    }
    console.log(`rpc not found for ${chain}`);
    return '';
};