import { networks, payments, Psbt} from "bitcoinjs-lib"
import ECPairFactory, { ECPairAPI, TinySecp256k1Interface } from "ecpair";
import { broadcast, toXOnly, tweakSigner, waitUntilUTXO } from "./taprootUtils";


const tinysecp: TinySecp256k1Interface = require('tiny-secp256k1');
const ECPair: ECPairAPI = ECPairFactory(tinysecp);
const network = networks.regtest;
const address = networks.regtest;


async function main() {
    const keypair = ECPair.makeRandom({ network });
    const tweakedSigner = tweakSigner(keypair, { network });

    const p2pktr = payments.p2tr({
        pubkey: toXOnly(tweakedSigner.publicKey),
        network
    })

    const p2pktr_addr = p2pktr.address ?? "";
    console.log(`Waiting till UTXO is detected at this Address: ${p2pktr_addr}`);

    const utxos = await waitUntilUTXO(p2pktr_addr)
    console.log(`Using UTXO ${utxos[0].txid}:${utxos[0].vout}`);

    const psbt = new Psbt({ network });
    psbt.addInput({
        hash: utxos[0].txid,
        index: utxos[0].vout,
        witnessUtxo: { value: utxos[0].value, script: p2pktr.output! },
        tapInternalKey: toXOnly(keypair.publicKey)
    });

    psbt.addOutput({
        address: "mohjSavDdQYHRYXcS3uS6ttaHP8amyvX78", // faucet address
        value: utxos[0].value - 150
    });

    psbt.signInput(0, tweakedSigner);
    psbt.finalizeAllInputs();

    const tx = psbt.extractTransaction();
    console.log(`Broadcasting Transaction Hex: ${tx.toHex()}`);
    const txid = await broadcast(tx.toHex());
    console.log(`Success! Txid is ${txid}`);

}   




main();
