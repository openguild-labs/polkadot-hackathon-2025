// change api , network

import { createConnection, Connection } from "typeorm";
import { Order } from "../entity/Order.js";
import { ethers, getBytes, solidityPackedKeccak256 } from "ethers";
import { Executor } from "../types/Executor.js";
import { ExecutorAbi } from "../abi/executor.js";
import { InterfaceAbi } from "ethers";
import {  broadcast, waitUntilUTXO } from "../utils/bitcoinUtils.js";
import {
  bitcoin_priv_key,
  eth_agg_key,
  eth_api,
  eth_priv_key,
  vaultAddress,
} from "../contants.js";
import { generateNonces, initializeDKG, PARTICIPANT_BASE_PORT, participantNonceCommitments, publicKey } from "../co-ordinator.js";
import axios from "axios";
import { Aggregator } from "../frost/aggregator.js";

import * as bitcoin from 'bitcoinjs-lib';
import  { ECPairFactory , ECPairAPI } from 'ecpair';
import * as ecc from "tiny-secp256k1";
import { network } from '../contants.js';
import { getTaprootHashesForSig } from "./taproot.js";
import { sign } from "../utils/ethereumUtils.js";




bitcoin.initEccLib(ecc as any);
const ECPair: ECPairAPI = ECPairFactory(ecc) 
const participantIndexes = [1 , 2];

class WatcherService {
  private connection: Connection;
  // private provider: ethers.Provider;
  // private executor: Executor;
  // private account: ethers.Signer;
  private privKey: Uint8Array;

  constructor() {

    this.privKey = getBytes(eth_agg_key);
  }

  public async initialize() {
    await this.initializeDatabase();
  }

  private async initializeDatabase() {
    this.connection = await createConnection({
      type: "sqlite",
      database: "orders.sqlite",
      entities: [Order],
      synchronize: true,
    });

    console.log("Connected to database");
  }

  public async watchUncompletedOrders() {
    const orderRepository = this.connection.getRepository(Order);

    while (true) {
      const uncompletedOrders = await orderRepository.find({
        where: [{ status: "created"  } , { status: "funding-detected" }],
      });

      for (const order of uncompletedOrders) {
        if (await this.checkOrderFunding(order)) {
          console.log(`Funding detected for order ${order.id}`);
          await this.completeOrder(order);
          console.log(`Completed order ${order.id}`);
        }
      }

      // Wait for 10secs before next check
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  private async checkOrderFunding(order: Order): Promise<boolean> {
    if (order.fromChain === "bitcoin") {
      try {
        const utxos = await waitUntilUTXO(order.vaultAddress);
        const funded_amount = utxos.reduce((sum, utxo) => sum + utxo.value, 0);
        const fundingtxids = utxos.map((utxo) => utxo.txid);

        if (funded_amount >= order.amount) {
          order.status = "funding-detected";
          order.srcTxid = fundingtxids.join(",");

          await this.connection.getRepository(Order).save(order);
          return true;
        } else {
          console.log(`Partial funding detected for order ${order.id}`);
          return false;
        }
      } catch (error) {
        console.error(`Error checking funding for order ${order.id}:`, error);
        return false;
      }
    } else if (order.fromChain.startsWith("evm")) {
      const chain = order.fromChain.slice(4);
      const provider = new ethers.JsonRpcProvider(eth_api(chain));
      const executor = new ethers.Contract(
        vaultAddress(chain!),
        ExecutorAbi as unknown as InterfaceAbi,
        provider
      ) as unknown as Executor;

      const amount = await executor.orderRegistery(`0x${order.orderHash}`);
      console.log(`Amount: ${amount}`);
      if (amount >= order.amount) {
        order.status = "funding-detected";
        await this.connection.getRepository(Order).save(order);
        return true;
      } else if (amount > 0) {
        console.log(`Partial funding detected for order ${order.id}`);
      } else {
        console.log(`No funding detected for order ${order.id}`);
      }

      return false;
    }

    return false;
  }

  private async completeOrder(order: Order) {
    if (order.toChain === "bitcoin") {
      console.log(`Completing order ${order.id}`);
      const txid = await sendFromTaproot(bitcoin_priv_key!, order.amount, order.toAddress);
      console.log(`Txid: ${txid}`);
      order.dstTxid = txid;
      order.status = "completed";
      await this.connection.getRepository(Order).save(order);
    } else if (order.toChain.startsWith("evm")) {
      const chain = order.toChain.slice(4);
      const provider = new ethers.JsonRpcProvider(eth_api(chain));
      const executor = new ethers.Contract(
        vaultAddress(chain),
        ExecutorAbi as unknown as InterfaceAbi,
        provider
      ) as unknown as Executor;
      const account = new ethers.Wallet(eth_priv_key!, provider);

      const Signature = 
      await agg_sign(getBytes(
          solidityPackedKeccak256(
            ["address", "uint256", "address"],
            [order.toAsset, order.amount, order.toAddress]
          )
        ).toString());

      
      const tx = await executor
        .connect(account)
        .mint(
          order.toAsset,
          order.amount,
          order.toAddress,
          ethers.concat([Signature.slice(0, 32), Signature.slice(32, 64)])
          // ethers.concat([Signature.e, Signature.s])
        );

      order.dstTxid = tx.hash;
      order.status = "completed";
      await this.connection.getRepository(Order).save(order);
    }
  }
}

const agg_sign = async (message : string) => {
  try {
    const nonceCommitments = participantIndexes.map((i: number) => participantNonceCommitments.get(i)![0]);
    participantIndexes.forEach((i: number) => {
      participantNonceCommitments.get(i)!.shift(); // Remove used nonce
    });

    const agg = new Aggregator(publicKey, Buffer.from(message), nonceCommitments, participantIndexes);
    const [signingMessage, nonceCommitmentPairs] = agg.signingInputs();

    const signatures = await Promise.all(
      participantIndexes.map((i: number) =>
        axios.post(`http://localhost:${PARTICIPANT_BASE_PORT + i - 1}/sign`, {
          message: signingMessage,
          nonceCommitmentPairs: nonceCommitmentPairs.map(pair => pair.map(p => p.secSerialize().toString('hex'))),
          participantIndexes,
        })
      )
    );

    // console.log(signatures);

    const signature = agg.signature(signatures.map((s) => BigInt("0x" + s.data.signature.replace("-" , ""))));
   

    return signature.toString('hex')
    
  } catch (error) {
    console.error("Sign error:", error);
    return '';
  }

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
      const hash = getTaprootHashesForSig(
          selectedUtxos[i].txid,
          selectedUtxos[i].vout,
          selectedUtxos[i].value,
          p2tr.output!,
          toXOnly(keypair.publicKey)
      )

      psbt.updateInput(i, {
        partialSig : [{
         pubkey : toXOnly(keypair.publicKey),
         signature : await agg_sign(hash.toString()).then(s => Buffer.from(s, 'hex'))   
        }]
      })
  }

  psbt.finalizeAllInputs();

  // Extract transaction
  const tx = psbt.extractTransaction();

  // Broadcast transaction
  const txid = await broadcast(tx.toHex());
  console.log(`Transaction broadcasted. Txid: ${txid}`);

  return txid;
}


// Start the watcher service
const watcherService = new WatcherService();
await watcherService.initialize();
await initializeDKG();
await generateNonces();
await agg_sign("0x02222222");
watcherService
  .watchUncompletedOrders()
  .catch((error) => console.error("Watcher service error:", error));

  
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