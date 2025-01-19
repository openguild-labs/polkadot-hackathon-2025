import { ethers } from "hardhat";
import { Executor, OzoneWrapperToken } from "../typechain-types";

async function main() {

    const vault_addr = "0xB05EE02Bd902dEb4AFcAeC64E6a137d2e5928154" // executor address
    const token_addr = "0x99B99274899F868De834Bd3af42CFca85223872e" // token address
    const schnorrLibrary = "0x30Da5Aa64C7Eb218102BFEAeE8069d73711caf0e"
    const orderHash  = `0x${"197d50e091cea8df488fbb435e2b209684794571b9332de951c1b0f0b4f87793"}`

    // let alice = await ethers.getSigner("0xdD2FD4581271e230360230F9337D5c0430Bf44C0"); // pen ultimate hardhat signer [local test]
    let alice = (await ethers.getSigners())[0]

    console.log("vault_addr", alice.address);
    const ExecutorFactory = await ethers.getContractFactory("Executor" , {
        libraries: {
          Schnorr: schnorrLibrary,
        }});
    const executor = ExecutorFactory.attach(vault_addr) as Executor;

    const TokenFactory = await ethers.getContractFactory("OzoneWrapperToken");
    let token = TokenFactory.attach(token_addr) as OzoneWrapperToken;

    await token.connect(alice).approve(executor.target, 1000);
    const tx = await executor.connect(alice).lock(token_addr , orderHash , 1000);
    await tx.wait();


    console.log("done lock funds", tx.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });