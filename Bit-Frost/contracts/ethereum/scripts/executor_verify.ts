import { getBytes, hexlify, randomBytes } from "ethers";
import { ethers } from "hardhat";
import secp256k1 from "secp256k1";
import { Executor, Executor__factory } from "../typechain-types";
import hre from "hardhat";

let privKey: Uint8Array;
let pubKey: Uint8Array;
let executor: Executor;

async function main() {

    // verify executor
    // const ExecutorFactory = await ethers.getContractFactory("Executor");

    privKey = getBytes("0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305");
    pubKey = secp256k1.publicKeyCreate(privKey);

   await  hre.run("verify:verify", {
      address: "0xB05EE02Bd902dEb4AFcAeC64E6a137d2e5928154",
      constructorArguments: [
        pubKey.slice(1, 33)
      ],
        libraries: {
          Schnorr: "0x30Da5Aa64C7Eb218102BFEAeE8069d73711caf0e",
        }
      }

    );

    await hre.run("verify:verify", {
      address: "0x99B99274899F868De834Bd3af42CFca85223872e",
      constructorArguments: [
        pubKey.slice(1, 33)
      ],
        libraries: {
          Schnorr: "0x9C8553Cf02E70EE8c2Dd41186b9CEb06a92cd3e4",
        }
      }
    );
      
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });