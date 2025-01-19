import { ethers } from "hardhat";
import { Schnorr } from "../../typechain-types";
import { randomBytes } from "crypto";
import secp256k1 from "secp256k1";
import { expect } from "chai";
import { keccak256 } from "ethers";
import { sign } from "../utils/utils";

const arrayify = ethers.getBytes;



describe("Schnorr Test Suite", function () {
  async function deployOnceFixture(): Promise<Schnorr> {
    const owner = await ethers.getSigners();
    const id = await ethers.getId();
    const schnorrLib = await ethers.getContractFactory("Schnorr");
    const schnorr = await schnorrLib.deploy();
    const schnorrContract = await schnorr.waitForDeployment();
    return schnorrContract as unknown as Schnorr;
  }

  it("Schnorr", async function () {
    const lib = await deployOnceFixture();

    let privKey;
    do {
      privKey = randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privKey));

    const pubKey = secp256k1.publicKeyCreate(privKey);
    const message = "howdy";
    const mDigest = arrayify(keccak256(Uint8Array.from(message, char => char.charCodeAt(0))));

    let sig = sign(mDigest, privKey);

    expect(await lib.verify(
        pubKey[0] - 2 + 27,
        pubKey.slice(1, 33),
        mDigest,
        sig.e,
        sig.s,
      )).to.equal(true);  

    expect(await lib.verify(
        pubKey[0] - 2 + 27,
        secp256k1.publicKeyCreate(randomBytes(32)).slice(1, 33),
        mDigest,
        sig.e,
        sig.s,
      )).to.be.false;  
  });
});
