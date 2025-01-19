import { ethers, parseEther } from "ethers";
import * as dotenv from "dotenv";
import dataLP from "../out/LaunchPoolFactory.sol/PoolFactory.json";
import dataBifrost from "../out/BifrostEarningMock.sol/BifrostEarningMock.json";
import vDot from "../out/BifrostEarningMock.sol/MockVDot.json";

dotenv.config();

const privateKey: string = process.env.testKey1!;
const HoleskyRPC: string = process.env.Holesky_RPC_URL!;
const WestendRPC: string = process.env.Westend_RPC_URL!;

// const provider = new ethers.JsonRpcProvider(HoleskyRPC);
const provider = new ethers.JsonRpcProvider(WestendRPC);
const wallet = new ethers.Wallet(privateKey, provider);

async function deployContract(): Promise<void> {
    try {
        const LaunchPoolFactory = new ethers.ContractFactory(dataLP.abi, dataLP.bytecode, wallet);
        const MockVDot = new ethers.ContractFactory(vDot.abi, vDot.bytecode, wallet);
        const BifrostEarning = new ethers.ContractFactory(dataBifrost.abi, dataBifrost.bytecode, wallet);

        console.log("Deploying MockVDot contract...");
        const vDotInstance = await MockVDot.deploy();
        await vDotInstance.waitForDeployment();
        const vDotAddress = await vDotInstance.getAddress();
        console.log("MockVDot deployed at address:", vDotAddress);

        console.log("Deploying BifrostEarning contract...");
        const bifrostInstance = await BifrostEarning.deploy(vDotAddress, 16);
        await bifrostInstance.waitForDeployment();
        const bifrostAddress = await bifrostInstance.getAddress();
        console.log("BifrostEarning deployed at address:", bifrostAddress);

        console.log("Transferring tokens to Bifrost contract...");
        const transferTx = await vDotInstance.transfer(bifrostAddress, parseEther("1000000000"));

        await transferTx.wait();
        console.log("Tokens transferred to Bifrost contract.");

        console.log("Deploying LaunchPoolFactory contract...");
        const launchPoolFactoryInstance = await LaunchPoolFactory.deploy(bifrostAddress);
        await launchPoolFactoryInstance.waitForDeployment();
        console.log("LaunchPoolFactory deployed at address:", await launchPoolFactoryInstance.getAddress());

        console.log("All contracts deployed successfully.");
    } catch (error) {
        console.error("Error during contract deployment:", error);
        process.exit(1);
    }
}

deployContract()
    .then(() => console.log("Deployment successful"))
    .catch((error) => console.error("Deployment failed", error));