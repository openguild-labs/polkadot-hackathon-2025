'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, Coins } from 'lucide-react'
import { BrowserWallet } from '@martifylabs/mesh';
import { useWallet } from '@martifylabs/mesh-react';

const wallets = [
  { name: 'Nami', icon: '/wallet-icons/nami.png' },
  { name: 'Eternl', icon: '/wallet-icons/eternl.png' },
  { name: 'Flint', icon: '/wallet-icons/flint.png' },
  { name: 'Gero', icon: '/wallet-icons/gero.png' },
  { name: 'Typhon', icon: '/wallet-icons/typhon.png' },
]

export default function CardanoWalletList() {
  const [open, setOpen] = useState(false);
  const [wallets, setWallets] = useState([]);
  const { connect } = useWallet();

  useEffect(() => {
    setWallets(BrowserWallet.getInstalledWallets());
    console.log(wallets);
  }, [])

  const connectWallet = async (walletname) => {
    try {
      // const address = 'addr1qx...'; // Example Cardano address
      // setWalletAddress(address);
      // setIsWalletConnected(true);
      await connect(walletname).then(() => {
        console.log("Connected")
        localStorage.setItem('walletConnected', 'true');
      });

    } catch (error) {
      console.error('Wallet connection failed', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Connect to a wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {wallets.map((wallet) => (
            <div key={wallet.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <Image
                    src={wallet.icon}
                    alt={`${wallet.name} icon`}
                    width={32}
                    height={32}
                  />
                </div>
                <span className="font-medium">{wallet.name}</span>
              </div>
              <Button 
                onClick={async() => {
                  console.log(`Connecting to ${wallet.name}`);
                  connectWallet(wallet.name);
                  setOpen(false);
                }}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Coins className="mr-2 h-4 w-4" />
                Connect
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
