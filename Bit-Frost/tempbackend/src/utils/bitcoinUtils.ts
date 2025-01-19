// change network

import axios, { AxiosResponse } from 'axios';
import * as bitcoin from 'bitcoinjs-lib';
import { regtest } from 'bitcoinjs-lib/src/networks.js';
import { TinySecp256k1Interface } from 'bitcoinjs-lib/src/types.js';
import  { ECPairFactory , ECPairAPI, ECPairInterface } from 'ecpair';
import * as ecc from "tiny-secp256k1";
import { blockstream, network } from '../contants.js';




bitcoin.initEccLib(ecc as any);
const ECPair: ECPairAPI = ECPairFactory(ecc) 

export function validateBitcoinAddress(address: string): boolean {
    try {
        bitcoin.address.toOutputScript(address , network);
        return true;
    } catch (e) {
        return false;
    }
}

export function generateTaprootAddress() {
    const keyPair = ECPair.makeRandom();
    const tweakedSigner = tweakSigner(keyPair, { network });
    const p2tr = bitcoin.payments.p2tr({
        pubkey: toXOnly(tweakedSigner.publicKey),
        network
    });   

    
    return  {address : p2tr.address! , privateKey : keyPair.toWIF()};
}

export async function sendFromTaproot(privkeyWIF: string, amount: number, toAddress: string) {

    const keypair = ECPair.fromWIF(privkeyWIF);

    // Derive taproot address from keypair
    const tweakedSigner = tweakSigner(keypair, { network });
    const p2tr = bitcoin.payments.p2tr({
        pubkey: toXOnly(tweakedSigner.publicKey),
        network
    });
    const taprootAddress = p2tr.address!;

    // console.log(`Taproot address: ${taprootAddress}`);

    // Fetch UTXOs
    const utxos = await waitUntilUTXO(taprootAddress);
    console.log(`Found ${utxos.length} UTXOs`);

    // Select UTXOs
    let totalAmount = 0;
    const selectedUtxos = [];
    for (const utxo of utxos) {
        selectedUtxos.push(utxo);
        totalAmount += utxo.value;
        if (totalAmount >= amount + 2000) { // Adding 1000 satoshis for fee
            break;
        }
    }

    if (totalAmount < amount + 2000) {
        throw new Error("Insufficient funds");
    }

    // Build transaction
    const psbt = new bitcoin.Psbt({ network });

    // Add inputs
    for (const utxo of selectedUtxos) {
        psbt.addInput({
            hash: utxo.txid,
            index: utxo.vout,
            witnessUtxo: { value: utxo.value, script: p2tr.output! },
            tapInternalKey: toXOnly(keypair.publicKey)
        });
    }

    // Add outputs
    psbt.addOutput({
        address: toAddress,
        value: amount
    });

    // Add change output if necessary
    const change = totalAmount - amount - 2000; // 1000 satoshis for fee
    if (change > 546) { // Only add change output if it's more than dust
        psbt.addOutput({
            address: taprootAddress,
            value: change
        });
    }

    // Sign inputs
    for (let i = 0; i < selectedUtxos.length; i++) {
        psbt.signInput(i, tweakedSigner);
    }

    psbt.finalizeAllInputs();

    // Extract transaction
    const tx = psbt.extractTransaction();

    // Broadcast transaction
    const txid = await broadcast(tx.toHex());
    console.log(`Transaction broadcasted. Txid: ${txid}`);

    return txid;
}


function tweakSigner(signer: bitcoin.Signer, opts: any = {}): bitcoin.Signer {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let privateKey: Uint8Array | undefined = signer.privateKey!;
    if (!privateKey) {
        throw new Error('Private key is required for tweaking signer!');
    }
    if (signer.publicKey[0] === 3) {
        privateKey = ecc.privateNegate(privateKey);
    }

    const tweakedPrivateKey = ecc.privateAdd(
        privateKey,
        tapTweakHash(toXOnly(signer.publicKey), opts.tweakHash),
    );
    if (!tweakedPrivateKey) {
        throw new Error('Invalid tweaked private key!');
    }

    return ECPair.fromPrivateKey(Buffer.from(tweakedPrivateKey), {
        network: opts.network,
    });
}

function tapTweakHash(pubKey: Buffer, h: Buffer | undefined): Buffer {
    return bitcoin.crypto.taggedHash(
        'TapTweak',
        Buffer.concat(h ? [pubKey, h] : [pubKey]),
    );
}

function toXOnly(pubkey: Buffer): Buffer {
    return pubkey.subarray(1, 33)
}

export async function waitUntilUTXO(address: string) {
    return new Promise<IUTXO[]>((resolve, reject) => {
        let intervalId: any;
        const checkForUtxo = async () => {
            try {
                const response: AxiosResponse<string> = await blockstream.get(`/address/${address}/utxo`);
                // console.log(response.data);
                const data: IUTXO[] = response.data ? JSON.parse(response.data) : undefined;
                // console.log(data);
                if (data.length > 0) {
                    resolve(data);
                    clearInterval(intervalId);
                }
            } catch (error) {
                reject(error);
                clearInterval(intervalId);
            }
        };
        intervalId = setInterval(checkForUtxo, 10000);
    });
}

export async function broadcast(txHex: string) {
    const response: AxiosResponse<string> = await blockstream.post('/tx', txHex);
    return response.data;
}

interface IUTXO {
    txid: string;
    vout: number;
    status: {
        confirmed: boolean;
        block_height: number;
        block_hash: string;
        block_time: number;
    };
    value: number;
}