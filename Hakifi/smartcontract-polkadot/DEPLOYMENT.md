# vnst deployment instruction

1. Create .env from .env.example
2. Fill in the main net information:

    ```bash
    TESTNETKEY=
    TESTNETAPI=
    USDTTESTNETADDRESS=
    ```

3. Run

    ```bash
        npx hardhat run --network bscTestnet scripts/staging/deploy_insurance.ts
    ```

   Should look like this:

    ```bash
    npx hardhat run --network bscTestnet scripts/staging/deploy_insurance.ts 
    Deploying HakifiProxy ...
    HakifiProxy deployed to: 0x98273046fA44e0E06E757819306e87482293285F
    ```

4. Copy the proxy deployed address, put it in the .env

    ```bash
    PROXYTESTNETADDRESS=
    ```

5. Verify the proxy address

    ```bash
        npx hardhat verify --network bscTestnet PROXYMAINNETADDRESS
    ```

   Should look like this

    ```bash
    npx hardhat verify --network bscTestnet 0x56f1A9FBBe52225EFcfd92868bEE47c17283a574
    Verifying implementation: 0xE2438c36E8fF7eDa213F1266C642D9C59e9Adc35
    The contract 0xE2438c36E8fF7eDa213F1266C642D9C59e9Adc35 has already been verified.
    https://bscTestnet.etherscan.io/address/0xE2438c36E8fF7eDa213F1266C642D9C59e9Adc35#code
    Verifying proxy: 0x56f1A9FBBe52225EFcfd92868bEE47c17283a574
    Contract at 0x56f1A9FBBe52225EFcfd92868bEE47c17283a574 already verified.
    Linking proxy 0x56f1A9FBBe52225EFcfd92868bEE47c17283a574 with implementation
    Successfully linked proxy to implementation.
    
    Proxy fully verified.
    ```

6. Upgrade smart contract

    ```bash
    npx hardhat run --network bscTestnet scripts/staging/upgrade_insurance.ts
    ```

   Should look like this

    ```bash
    npx hardhat verify --network bscTestnet scripts/staging/upgrade_insurance.ts
    Upgrading Hakifi ...
    Hakifi upgraded to: 0x72903d47B4F08103342BdE36d5D4E256Da06151c
    ```

7. Verify

    ```bash
        npx hardhat verify --network bscTestnet PROXYMAINNETADDRESS
    ```

   Should look like this

    ```bash
    npx hardhat verify --network bscTestnet 0x56f1A9FBBe52225EFcfd92868bEE47c17283a574
    Verifying implementation: 0xE2438c36E8fF7eDa213F1266C642D9C59e9Adc35
    The contract 0xE2438c36E8fF7eDa213F1266C642D9C59e9Adc35 has already been verified.
    https://bscTestnet.etherscan.io/address/0xE2438c36E8fF7eDa213F1266C642D9C59e9Adc35#code
    Verifying proxy: 0x56f1A9FBBe52225EFcfd92868bEE47c17283a574
    Contract at 0x56f1A9FBBe52225EFcfd92868bEE47c17283a574 already verified.
    Linking proxy 0x56f1A9FBBe52225EFcfd92868bEE47c17283a574 with implementation
    Successfully linked proxy to implementation.

    Proxy fully verified.
    ```
