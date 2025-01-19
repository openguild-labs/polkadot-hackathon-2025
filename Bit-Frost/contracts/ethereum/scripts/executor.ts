import { getBytes, hexlify, randomBytes } from "ethers";
import { ethers } from "hardhat";
import secp256k1 from "secp256k1";
import { Executor, Executor__factory } from "../typechain-types";

let privKey: Uint8Array;
let pubKey: Uint8Array;
let executor: Executor;

async function main() {
    const Schnorr = await ethers.getContractFactory("Schnorr");
    const schnorr = await Schnorr.deploy();
    await schnorr.waitForDeployment();
    console.log(schnorr.target);

    privKey = getBytes("0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305");
    pubKey = secp256k1.publicKeyCreate(privKey);

  
      const ExecutorFactory = (await ethers.getContractFactory("Executor", {
        libraries: {
          Schnorr: schnorr.target.toString(),
        },
      })) as Executor__factory;
      executor = await ExecutorFactory.deploy(pubKey.slice(1, 33));
      await executor.waitForDeployment();

      const newToken = await executor.createAndRegisterToken.staticCall(
        "Ozone Bitcoin",
        "oBTC",
        8,
        randomBytes(64)
      );
      
      await executor.createAndRegisterToken("Ozone Bitcoin", "oBTC", 8, randomBytes(64));


      console.log("Executor deployed to:", executor.target);
      console.log("New token deployed to:", newToken);
      console.log("schnorr target", schnorr.target);
      console.log("privKey", hexlify(privKey));
      console.log("pubKey", hexlify(pubKey));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


// sepolia
// 0x21BaCd0133C09baC8E29550c4BB3F1072F753CDA
// Executor deployed to: 0xAe5a73661222DdC593CC987C186801B45072014b
// New token deployed to: 0xa0907fA317E90d6cE330d28565E040f0474E932E
// schnorr target 0x21BaCd0133C09baC8E29550c4BB3F1072F753CDA
// privKey 0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305
// pubKey 0x025555cd61d59ad4216644c3855bd3ce864b36c5c221faa390219a2d609ecc2bb8

//  base
// 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// Executor deployed to: 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// New token deployed to: 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
// schnorr target 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// privKey 0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305
// pubKey 0x025555cd61d59ad4216644c3855bd3ce864b36c5c221faa390219a2d609ecc2bb8

//  scroll
// 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// Executor deployed to: 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// New token deployed to: 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
// schnorr target 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// privKey 0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305
// pubKey 0x025555cd61d59ad4216644c3855bd3ce864b36c5c221faa390219a2d609ecc2bb8

// Amoy Polygon
// 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// Executor deployed to: 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// New token deployed to: 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
// schnorr target 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// privKey 0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305
// pubKey 0x025555cd61d59ad4216644c3855bd3ce864b36c5c221faa390219a2d609ecc2bb8

// Optimism
// 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// Executor deployed to: 0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f
// New token deployed to: 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
// schnorr target 0x373AD9B7bCde205BA7c5769BeFB20F4b06095561
// privKey 0x4da08f2d9ac12aa8ef962f089cb902700c750ffcee38a3020ef190f5a220c305
// pubKey 0x025555cd61d59ad4216644c3855bd3ce864b36c5c221faa390219a2d609ecc2bb8
