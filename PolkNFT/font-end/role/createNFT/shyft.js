import {clusterApiUrl, Connection, Keypair, Transaction } from "@solana/web3.js";
import { Buffer } from "buffer";

export async function confirmTransactionFromFrontend(connection, encodedTransaction, wallet) {
    console.log(encodedTransaction);
    const recoveredTransaction = Transaction.from(
      Buffer.from(encodedTransaction, "base64")
    );
    const signedTx = await wallet.signTransaction(recoveredTransaction);
    const confirmTransaction = await connection.sendRawTransaction(
      signedTx.serialize(),
    );
    return confirmTransaction;
  }