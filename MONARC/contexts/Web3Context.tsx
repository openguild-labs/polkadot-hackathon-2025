"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import Web3 from 'web3';
import { Contract, ContractAbi } from 'web3';

interface LoanDetails {
  active: boolean;
  loanAmount: string;
  collateralAmount: string;
  interestRate: number;
  destinationChain: number;
  duration: number;
  paidCollateral: string;
}

// Define a base contract interface that extends the Contract type


interface Web3ContextType {
  selectedNetwork: string;
  setSelectedNetwork: (network: string) => void;
  account: string;
  setAccount: (account: string) => void;
  web3: Web3 | null;
  setWeb3: (web3: Web3 | null) => void;
  DynamicNFTContract: any | null;
  setDynamicNFTContract: (contract: any | null) => void;
  RoyaltyContract: any | null;
  setRoyaltyContract: (contract: any | null) => void;
  MonitorContract: any | null;
  setMonitorContract: (contract: any | null) => void;
  ReactContract: any | null;
  setReactContract: (contract: any | null) => void;
  WNFTContract: any | null;
  setWNFTContract: (contract: any | null) => void;
  IpfsHashStorageContract: any | null;
  setIpfsHashStorageContract: (contract: any | null) => void;
 
}

// Create the context with a default value matching the type
const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [account, setAccount] = useState<string>('');
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [DynamicNFTContract, setDynamicNFTContract] = useState<any | null>(null);
  const [RoyaltyContract, setRoyaltyContract] = useState<any | null>(null);
  const [MonitorContract, setMonitorContract] = useState<any | null>(null);
  const [ReactContract, setReactContract] = useState<any | null>(null);
  const [WNFTContract, setWNFTContract] = useState<any | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [IpfsHashStorageContract, setIpfsHashStorageContract] = useState<any | null>(null);


  

  const value: Web3ContextType = {
    selectedNetwork,
    setSelectedNetwork,
    account,
    web3,
    setWeb3,
    setAccount,
    DynamicNFTContract,
    setDynamicNFTContract,
    RoyaltyContract,
    setRoyaltyContract,
    MonitorContract,
    setMonitorContract,
    ReactContract,
    setReactContract,
    WNFTContract,
    setWNFTContract,
    IpfsHashStorageContract,
    setIpfsHashStorageContract,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

// Custom hook to use the Web3 context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}