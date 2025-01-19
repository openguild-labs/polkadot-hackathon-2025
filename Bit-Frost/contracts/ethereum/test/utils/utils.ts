import { hexlify, keccak256, randomBytes } from "ethers";
import { ethers } from "hardhat";
import secp256k1 from "secp256k1";

const arrayify = ethers.getBytes;

export function sign(m: Uint8Array, x: Uint8Array) {
    const publicKey = secp256k1.publicKeyCreate(x);
  
    // R = G * k
    const k = randomBytes(32);
    const R = secp256k1.publicKeyCreate(k);
  
    // e = h(address(R) || compressed pubkey || m)
    const e = challenge(R, m, publicKey);
  
    // xe = x * e
    const xe = secp256k1.privateKeyTweakMul(x, e);
  
    // s = k + xe
    const s = secp256k1.privateKeyTweakAdd(k, xe);
    return { R, s, e };
  }
  
  function challenge(R: Uint8Array, m: Uint8Array, publicKey: Uint8Array) {
    var R_uncomp = secp256k1.publicKeyConvert(R, false);
    var R_addr = arrayify(keccak256(R_uncomp.slice(1, 65))).slice(
      12,
      32
    );
  
    var e = arrayify(
      ethers.solidityPackedKeccak256(
        ["address", "uint8", "bytes32", "bytes32"],
        [hexlify(R_addr), publicKey[0] + 27 - 2, publicKey.slice(1, 33), m]
      )
    );
  
    return e;
  }