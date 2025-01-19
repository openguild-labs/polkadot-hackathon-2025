# PolFT

PolFT is an Interchain Gaming NFT Leasing platform designed to deliver a seamless and comprehensive experience for the entire NFT leasing process through a one-stop, user-friendly interface. The platform focuses on cross-chain circulation and use cases within the [Polkadot](https://polkadot.com/) ecosystem, leveraging the power of [AssetHub](https://wiki.polkadot.network/docs/learn-assets).

What sets PolFT apart is its cross-chain functionality, enabling users to lend, rent, and manage gaming NFTs effortlessly across parachains. By embracing interoperability, PolFT unlocks new opportunities for users to utilize their gaming NFT assets, connect with a broader audience, and maximize their utility in innovative ways.

## **Team Members**

- **Draply**: Leader, Smart Contract Developer
- **xiaohe139**: Team Member, UI Developer

**Contact Information:** [Draply's LinkedIn](https://www.linkedin.com/in/draplydo/)

## Overview

### Demo

Watch our demo video [here](https://youtu.be/mVf4POCkvuE).

### Technology Stack

- **Smart Contract:** Solidity, Hardhat
- **UI:** Next.js, TypeScript

### Key Features

1. User-friendly interface for NFT rental marketplace
2. Display of NFT collections
3. Native NFTs listing for leasing and renting
4. Management of owned and rented NFTs
5. Payments between lessees and lessors on any parachain via **AssetHub**, optimizing transaction costs

### Workflow

#### Fee Analysis

- **Service Fee**: Paid in the native token of the game or an ERC20 token on the game chain. The fee is charged only once to both lessees and lessors.  
- **NFT Rental Fee**: Lessees can pay lessors in DOT or any token that supports cross-chain bridging via AssetHub. The token is automatically bridged to the lessor's target chain.

#### Lending Workflow

1. Lessors approve the contract to hold their NFT.  
2. Lessors approve the contract to deduct the service fee token from their accounts.  
3. The lending logic is executed by the contract.

#### Renting Workflow

1. Lessees approve the contract to deduct the service fee token from their accounts.  
2. Lessees approve the contract to deduct DOT (or another token) from their accounts.  
3. The contract holds the service fee token and DOT from the lessee's account.  
4. When the rental period expires or the lessee returns the NFT, the lessor can claim their tokens.

### Challenges

Currently, we are unable to create a foreign asset on Westend AssetHub for cross-chain payments between lessors and lessees. However, this functionality will work smoothly on Polkadot AssetHub using the DOT token once funded.

### Future Plans

1. Create a foreign asset on Westend AssetHub for testing.
2. Integrate a backend server.
3. Enable payments to lessors using tokens other than DOT.

## Execution Instructions

### Requirements

- [Node.js](https://nodejs.org/en)

### Setup

1. **Clone the Repository**

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/xiaohe139/polft
cd polft
```

3. **Run the project**

Install dependencies and start the development server:

```bash
npm i
npm run dev
```
