// import {  clusterApiUrl, Connection,PublicKey } from "@solana/web3.js";
// import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
// import { confirmTransactionFromFrontend } from "./shyft.js";

// export async function signAndConfirmTransactionFe(network,transaction,callback)
// {
//     const phantom = new PhantomWalletAdapter();
//     await phantom.connect();
//     const rpcUrl = clusterApiUrl(network);
//     const connection = new Connection(rpcUrl,"confirmed");

//     const ret = await confirmTransactionFromFrontend(connection,transaction,phantom);

//     console.log(ret);

//     connection.onSignature(ret,callback,"finalized")
//     return ret;
// }
