import { exec, ChildProcess } from 'child_process';
import { ethers } from 'ethers';
import { readFileSync, writeFileSync } from 'fs';
import { PoolFactoryABI } from '../abi/';
import { convertNumToOnChainFormat } from './decimals';

export function startAnvil(): ChildProcess {
  // Spawn Anvil process
  const anvilProcess = exec('anvil', (error, stdout, stderr) => {
    if (error) {
      console.error("\x1b[31m%s\x1b[0m", `Error starting Anvil: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error("\x1b[31m%s\x1b[0m", `Anvil stderr: ${stderr}`);
      return;
    }
    console.log(`Anvil output: ${stdout}`);
  });

  // Set up a handler to kill the Anvil process when the Node.js process exits
  process.on('exit', () => {
    console.log('Stopping Anvil...');
    anvilProcess.kill();
  });

  return anvilProcess;
}

export function getSigner(
  privateKey: string,
  provider: ethers.providers.BaseProvider
): ethers.Wallet {
  const wallet = new ethers.Wallet(privateKey); // Insert a private key from Anvil's default accounts
  const signer = wallet.connect(provider);
  return signer;
}

export function getProvider(url: string): ethers.providers.JsonRpcProvider {
  const provider = new ethers.providers.JsonRpcProvider(url); // Insert a private key from Anvil's default accounts
  return provider;
}

// Example: Interacting with Anvil via ethers.js
export async function deployContract(
  contractName: string,
  signer: ethers.Wallet,
  nameAlias: string | undefined,
  ...constructorArgs: any[]
): Promise<ethers.Contract> {
  const artifactsPath = "app/abi/".concat(contractName, ".json");
  const artifacts = readFileSync(artifactsPath, { encoding: "utf-8" });
  const artifactsJSON = JSON.parse(artifacts);
  const abi = artifactsJSON["abi"];
  const bytecode = artifactsJSON["bytecode"];
  if (!abi || !bytecode) {
    throw new Error("abi/bytecode of contract not found");
  }
  const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);

  // Deploy the contract
  const contract = await contractFactory.deploy(...constructorArgs);

  // Wait for the deployment transaction to be mined
  await contract.deployTransaction.wait();

  // write new contract address to chainConfig file
  let chainConfigJSON = JSON.parse(readFileSync("app/config/chainConfig.json", { encoding: "utf-8" }));
  // console.log(`Chain config json: ${chainConfigJSON}`);
  const nameInConfig = !!nameAlias ? nameAlias : contractName;
  // console.log(`Name in config: ${nameInConfig}`);
  if (Object.keys(chainConfigJSON[31337]?.contracts)?.findIndex((v) => v === nameInConfig) != -1) {
    chainConfigJSON[31337]["contracts"][nameInConfig]["address"] = contract.address;

    if (nameInConfig === "MockVDot") {
      let vAsset: any = (chainConfigJSON[31337]["vAssets"] as object[]).find((obj: any) => obj["symbol"] === "vDOT")
      vAsset["address"] = contract.address;
    } 
    // else if (nameInConfig === "MockVGLMR") {
    //   let vAsset: any = (chainConfigJSON[31337]["vAssets"] as object[]).find((obj: any) => obj["symbol"] === "vGLMR")
    //   vAsset["address"] = contract.address;
    // } else
    // else if (nameInConfig === "MockERC20MintOnInit") {
    //   let contractSymbol = constructorArgs[1];
    //   console.log(`Contract symbol: ${contractSymbol}`);
    //   let vAsset: any = (chainConfigJSON[31337]["vAssets"] as object[]).find((obj: any) => obj["symbol"] === contractSymbol)
    //   console.log(`vAsset: ${vAsset}`);
    //   vAsset["address"] = contract.address;

    // }
  }
  writeFileSync("app/config/chainConfig.json", JSON.stringify(chainConfigJSON, null, 2));
  console.log('\x1b[32m%s\x1b[0m', `Saved ${nameInConfig} contract address to app/config/chainConfig.json`);
  return contract;
}

export async function getCurrentBlockTimestamp(provider: ethers.providers.Provider): Promise<number> {
  const block = await provider.getBlock('latest');
  return block.timestamp;
}

async function run(): Promise<void> {
  // startAnvil();

  // const provider = getProvider("http://127.0.0.1:8545");
  const provider = getProvider("http://localhost:8545");


  const foundryTestPrivKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
  const signer = getSigner(foundryTestPrivKey, provider)


  // const vTokenDataForCollateral = [
  //   {
  //     name: "voucher Astar",
  //     symbol: "vASTAR",
  //     amount: 1000000000,
  //   },

  //   {
  //     name: "voucher WestEnd",
  //     symbol: "vWND",
  //     amount: 1000000000,
  //   },

  //   {
  //     name: "voucher MoonBeam",
  //     symbol: "vGLMR",
  //     amount: 1000000000,
  //   }

  // ]
  // // deploy mockVToken contract
  // for (let i = 0; i < vTokenDataForCollateral.length; i++) {
  //   const mockVAssetContract = await deployContract(
  //     "MockERC20MintOnInit",
  //     signer,
  //     undefined,
  //     vTokenDataForCollateral[i].name,
  //     vTokenDataForCollateral[i].symbol,
  //     convertNumToOnChainFormat(vTokenDataForCollateral[i].amount, 18),
  //   );
  //   const mockVTokenAddr = mockVAssetContract.address;
  //   console.log('\x1b[36m%s\x1b[0m', `Mock VToken contract ${vTokenDataForCollateral[i].name} deployed to ${mockVTokenAddr}`);
  // }
  const mockVDot = await deployContract( //launchpool
    "MockVDot",
    signer,
    undefined,
  );

  const mockVDotAddress = mockVDot.address;


  const mockVGLMR = await deployContract(
    "MockERC20MintOnInit",
    signer,
    undefined,
    "voucher Moonbeam",
    "vGLMR",
    convertNumToOnChainFormat(1000000000, 18),
  )

  const mockVGLMRAddress = mockVGLMR.address;


  // await mockVAssetContract.freeMoneyForEveryone(
  //     "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  //     BigInt(1000 * (10 ** 9) * 10 ** 18),
  // );
  // }

  // const mockVAssetContract = await deployContract(
  //   "",
  //   signer,
  //   undefined,
  // );
  // const mockVTokenAddr = mockVAssetContract.address;
  // // await mockVAssetContract.freeMoneyForEveryone(
  // //     "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  // //     BigInt(1000 * (10 ** 9) * 10 ** 18),
  // // );


  // deploy BifrostEarningMock contract
  const bifrostEarningMockContract = await deployContract(
    "BifrostEarningMock",
    signer,
    undefined,
    mockVDotAddress,
    BigInt(10 ** 18),
  );
  const bifrostEarningMockAddr = bifrostEarningMockContract.address;

  // deploy ProjectPoolFactory contract
  const factoryContract = await deployContract(
    "PoolFactory",
    signer,
    undefined,
    // ethers.constants.AddressZero,
    bifrostEarningMockAddr,
  );
  const factoryAddr = factoryContract.address;

  // deploy ProjectPoolFactory contract


  // deploy mockVToken and mockProjectToken


  const mockProjectTokenContract = await deployContract(
    "MockProjectToken",
    signer,
    undefined,
  );
  const mockProjectTokenAddr = mockProjectTokenContract.address;

  const preMarketFactoryContract = await deployContract(
    "PreMarketFactory",
    signer,
    undefined,
    convertNumToOnChainFormat(2, 18),
  );

  const preMarketFactoryAddr = preMarketFactoryContract.address;
  


  
  // await mockProjectTokenContract.freeMoneyForEveryone(
  //     "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  //     BigInt(1000 * (10 ** 9) * 10 ** 18),
  // );

  // // create example project pool
  // const blockTimestamp = await getCurrentBlockTimestamp(provider);
  // const startTime = blockTimestamp + 2;
  // // wait 2 secs
  // await new Promise(resolve => setTimeout(resolve, 2000));
  // const totalProjectTokens = BigInt(1000 * (10 ** await mockProjectTokenContract.decimals()));
  // const maxVTokensPerStaker = BigInt(10 * (10 ** await mockVAssetContract.decimals()));
  // const minVTokensPerStaker = BigInt(1 * (10 ** await mockVAssetContract.decimals()));
  // const targetStakeAmount = BigInt(100 * (10 ** await mockProjectTokenContract.decimals()));

  // const tx = await factoryContract.createPool(
  //   mockProjectTokenAddr,
  //   mockVTokenAddr,
  //   BigInt(startTime), // start time
  //   BigInt(startTime + (60 * 60)), // end time = start time + 60 minutes
  //   totalProjectTokens,
  //   maxVTokensPerStaker,
  //   minVTokensPerStaker,
  //   targetStakeAmount,
  //   // BigInt(10 * (10 ** await mockVAssetContract.decimals())), // 1 project token = 10 vTokens
  //   // BigInt(1 * (10 ** await mockVAssetContract.decimals())), // min invest is 1 vTokens
  //   // BigInt(10 * (10 ** await mockVAssetContract.decimals())), // max invest is 10 vTokens
  //   // BigInt(1000 * (10 ** await mockProjectTokenContract.decimals())), // hard cap is 1000 vTokens
  //   // BigInt(100 * (10 ** await mockProjectTokenContract.decimals())), // soft cap is 1000 vTokens
  //   // BigInt(50), // 0.5%,
  // );

  // const waitTx = await tx.wait();
  // console.log(waitTx);
  // const poolAddr = await factoryContract.getPoolAddress(1);

  console.log('\x1b[36m%s\x1b[0m', `Mock BifrostEarning contract deployed to ${bifrostEarningMockAddr}`);
  console.log('\x1b[36m%s\x1b[0m', `PoolFactory contract deployed to ${factoryAddr}`);
  console.log('\x1b[36m%s\x1b[0m', `PreMarketFactory contract deployed to ${preMarketFactoryAddr}`);
  // console.log('\x1b[36m%s\x1b[0m', `Pool Address: ${poolAddr}`);
  console.log('\x1b[36m%s\x1b[0m', `Mock VDOT contract deployed to ${mockVDotAddress}`);
  console.log('\x1b[36m%s\x1b[0m', `Mock VGLMR contract deployed to ${mockVGLMRAddress}`);
  console.log('\x1b[36m%s\x1b[0m', `Mock ProjectToken contract deployed to ${mockProjectTokenAddr}`);
  // console.log('\x1b[36m%s\x1b[0m', `An example ProjectPool contract was created at address ${poolAddr}`);

  async function invest() {
    const provider = getProvider('http://localhost:8545');
    const signer = getSigner("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const poolContract = new ethers.Contract(
      "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
      PoolFactoryABI,
      signer
    );

    try {
      const tx = await poolContract.investProject(
        BigInt("9500000000000000000")
      );
      console.debug(`invest response:\n${tx}`);
    } catch (err) {
      console.error(`error when sending invest():\n${err}`);
    }
  }
}

run().then().catch(err => console.error(err))

async function testXCMOracle() {
  const provider = getProvider('');
  const signer = getSigner("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
  const poolContract = new ethers.Contract(
    "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
    PoolFactoryABI,
    signer
  );

  try {
    const tx = await poolContract.investProject(
      BigInt("9500000000000000000")
    );
    console.debug(`invest response:\n${tx}`);
  } catch (err) {
    console.error(`error when sending invest():\n${err}`);
  }

}

// invest().then().catch();