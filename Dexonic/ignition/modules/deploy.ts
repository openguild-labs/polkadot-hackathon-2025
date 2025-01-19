import { ethers } from 'hardhat';
import stellaSwap from '@stellaswap/swap-sdk';

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);

    // StellaSwap SDK initialization
    const addresses = await stellaSwap.getAddresses();
    const spender = addresses.permit2;

    const tokenAddress = '0x0E358838ce72d5e61E0018a2ffaC4bEC5F4c88d2';
    const erc20Instance = await ethers.getContractAt('ERC20', tokenAddress);
    const allowance = await stellaSwap.checkAllowance(deployer.address, erc20Instance, spender);

    console.log('StellaSwap Spender Address:', spender);
    console.log('Allowance:', allowance);

    // Deploy Dex contract
    const Dex = await ethers.getContractFactory('Dex');
    const defaultAdmin = deployer.address;
    const dex = await Dex.deploy(tokenAddress, defaultAdmin, 'DexToken', 'DEX');

    await dex.waitForDeployment();

    console.log('Dex deployed to:', dex.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
