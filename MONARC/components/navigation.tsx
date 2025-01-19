'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, ChevronDown, Menu, Moon, Search, Settings, Sun } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from 'next-themes'
import { useWeb3 } from '@/contexts/Web3Context';

// Import your contract ABIs and addresses
import {
  DYNAMICNFT_CONTRACT_ADDRESS,
  ROYALTY_CONTRACT_ADDRESS,
  MONITOR_CONTRACT_ADDRESS,
  WNFT_CONTRACT_ADDRESS,
  REACT_CONTRACT_ADDRESS,
  IPFS_HASH_STORAGE_CONTRACT_ADDRESS
} from '@/config/addresses';

import DYNAMICNFT_ABI from '@/config/abi/DynamicNFT_ABI.json';
import ROYALTY_ABI from '@/config/abi/Royalty_ABI.json';
import MONITOR_ABI from '@/config/abi/Monitor_ABI.json';
import WNFT_ABI from '@/config/abi/WNFT_ABI.json';
import REACT_ABI from '@/config/abi/React_ABI.json';
import IPFS_HASH_STORAGE_ABI from '@/config/abi/IpfsHash_Storage_ABI.json';
import { ThemeToggle } from './ThemeToggle';


interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
}

interface SupportedNetworks {
  [key: string]: NetworkConfig;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const SUPPORTED_NETWORKS: SupportedNetworks = {
  SEPOLIA: {
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/5fa6d48931744b27a5f31bb69fe1e2d0'
  },
  KOPLI: {
    chainId: 5318008,
    name: 'Kopli',
    rpcUrl: 'https://kopli-rpc.rkt.ink'
  }
};


export default function Navigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [chainId, setChainId] = useState<number>(11155111);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    selectedNetwork,
    setSelectedNetwork,
    account,
    setAccount,
    web3,
    setWeb3,
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
    setIpfsHashStorageContract
  } = useWeb3();

  const getCurrentNetworkKey = (currentChainId: number): string => {
    return Object.keys(SUPPORTED_NETWORKS).find(
      key => SUPPORTED_NETWORKS[key].chainId === currentChainId
    ) || '';
  };

  const initializeContracts = async (web3Instance: Web3, currentChainId: number): Promise<void> => {
    // Reset all contracts first
    setDynamicNFTContract(null);
    setRoyaltyContract(null);
    setMonitorContract(null);
    setReactContract(null);
    setWNFTContract(null);

    if (currentChainId === SUPPORTED_NETWORKS.KOPLI.chainId) {
      try {
        // Initialize Kopli network contracts
        const reactContract = new web3Instance.eth.Contract(REACT_ABI, REACT_CONTRACT_ADDRESS);
        const wnftContract = new web3Instance.eth.Contract(WNFT_ABI, WNFT_CONTRACT_ADDRESS);
        
        setReactContract(reactContract);
        setWNFTContract(wnftContract);
        console.log("Initialized Kopli contracts:", { reactContract, wnftContract });
      } catch (error) {
        console.error("Error initializing Kopli contracts:", error);
      }
    } else if (currentChainId === SUPPORTED_NETWORKS.SEPOLIA.chainId) {
      try {
        // Initialize Sepolia network contracts
        const DynamicNFTContract = new web3Instance.eth.Contract(DYNAMICNFT_ABI, DYNAMICNFT_CONTRACT_ADDRESS);
        const royaltyContract = new web3Instance.eth.Contract(ROYALTY_ABI, ROYALTY_CONTRACT_ADDRESS);
        const monitorContract = new web3Instance.eth.Contract(MONITOR_ABI, MONITOR_CONTRACT_ADDRESS);
        const IpfsHashStorageContract = new web3Instance.eth.Contract(IPFS_HASH_STORAGE_ABI, IPFS_HASH_STORAGE_CONTRACT_ADDRESS); 

        setDynamicNFTContract(DynamicNFTContract);
        setRoyaltyContract(royaltyContract);
        setMonitorContract(monitorContract);
        setIpfsHashStorageContract(IpfsHashStorageContract);
        console.log("Initialized Sepolia contracts:", { DynamicNFTContract, royaltyContract, monitorContract, IpfsHashStorageContract });
      } catch (error) {
        console.error("Error initializing Sepolia contracts:", error);
      }
    }
  };

  const connectWallet = async (): Promise<void> => {
    if (!window.ethereum) {
      setError('Please install MetaMask!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const web3Instance = new Web3(window.ethereum);
        const chainId = Number(await web3Instance.eth.getChainId());
        setChainId(chainId);
        setSelectedNetwork(getCurrentNetworkKey(chainId));
        setWeb3(web3Instance);
        
        await initializeContracts(web3Instance, chainId);
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchNetwork = async (networkName: string): Promise<void> => {
    try {
      setIsLoading(true);
      const network = SUPPORTED_NETWORKS[networkName.toUpperCase()];
      if (!network) throw new Error('Unsupported network');

      const chainIdHex = `0x${network.chainId.toString(16)}`;
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: network.name,
              rpcUrls: [network.rpcUrl],
            }],
          });
        } else {
          throw switchError;
        }
      }

      setSelectedNetwork(networkName);
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      
      const currentChainId = await web3Instance.eth.getChainId();
      setChainId(Number(currentChainId));
      
      await initializeContracts(web3Instance, Number(currentChainId));
    } catch (error) {
      console.error('Error switching network:', error);
      setError('Failed to switch network');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      web3Instance.eth.getChainId().then(async (currentChainId) => {
        setChainId(Number(currentChainId));
        const networkKey = getCurrentNetworkKey(Number(currentChainId));
        setSelectedNetwork(networkKey);
        await initializeContracts(web3Instance, Number(currentChainId));
      });

      web3Instance.eth.getAccounts().then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
        }
      };

      const handleChainChanged = async (newChainId: string) => {
        const chainIdDecimal = parseInt(newChainId, 16);
        setChainId(chainIdDecimal);
        const networkKey = getCurrentNetworkKey(chainIdDecimal);
        setSelectedNetwork(networkKey);
        await initializeContracts(web3Instance, chainIdDecimal);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Collections', href: '/collections' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Create NFT', href: '/createNFT' },
  ]

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 pl-10 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-900 dark:border-gray-700 transition-colors duration-300">
        <div className="container flex h-14 items-center">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-sm font-medium"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src="/MONARC.jpg"
                alt="Logo"
              />
              <span className="hidden font-bold sm:inline-block">MONARC</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Input
                type="search"
                placeholder="Search..."
                className="h-9 md:w-[300px] text-black dark:text-white dark:bg-gray-800 lg:w-[300px]"
              />
            </div>
            
            <ThemeToggle />
            <Button size="icon" variant="ghost">
              <Link href="/settings">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
              </Link>
            </Button>
            <Select 
        value={selectedNetwork} 
        onValueChange={(value) => switchNetwork(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Network" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SEPOLIA">Ethereum Sepolia</SelectItem>
          <SelectItem value="KOPLI">Kopli</SelectItem>
        </SelectContent>
      </Select>
      <Button 
        onClick={connectWallet}
        disabled={isLoading}
        variant={error ? "destructive" : "default"}
      >
        {isLoading ? (
          "Connecting..."
        ) : error ? (
          "Error Connecting"
        ) : account ? (
          formatAddress(account)
        ) : (
          "Connect Wallet"
        )}
      </Button>
          </div>
        </div>
      </header>
    </div>
  )
}