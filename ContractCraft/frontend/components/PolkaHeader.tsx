import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const PolkaHeader = () => {
  const [walletAddress, setWalletAddress] = React.useState<string | null>(null);
  const [api, setApi] = React.useState<ApiPromise | null>(null);

  const connectWallet = async () => {
    try {
      // Initialize the provider with the custom endpoint
      const provider = new WsProvider('wss://rpc1.paseo.popnetwork.xyz');
      
      // Create the API instance
      const api = await ApiPromise.create({ provider });
      setApi(api);

      // Enable the extension
      const extensions = await web3Enable('ContractCraft');
      
      if (extensions.length === 0) {
        window.open('https://polkadot.js.org/extension/', '_blank');
        return;
      }

      // Get all accounts from the extension
      const accounts = await web3Accounts();
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0].address);
      }

      // Get chain info
      const [chain, nodeName, nodeVersion] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version()
      ]);

      console.log(`Connected to ${chain} using ${nodeName} v${nodeVersion}`);
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  };

  const disconnectWallet = async () => {
    if (api) {
      await api.disconnect();
      setApi(null);
      setWalletAddress(null);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-background backdrop-blur-md border-b border-primary/20">
      <div className="max-w-7xl mx-auto h-16 px-6">
        <div className="flex items-center justify-between h-full">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 py-2",
              "rounded-xl",
              "hover:translate-y-[-2px]",
              "transition-all duration-200"
            )}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/polkadot-logo.svg" width={28} height={28} alt="Polkadot Logo" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-xl tracking-tight text-foreground">
                ContractCraft
              </span>
              <span className="text-xs font-medium text-muted-foreground tracking-tight">
                Polkadot Smart Contract Platform
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {walletAddress ? (
              <div className="flex items-center gap-4">
                <div className={cn(
                  "hidden sm:flex items-center gap-2 px-4 py-2",
                  "bg-background/50 border border-primary/20 rounded-xl",
                  "backdrop-blur-md",
                  "font-medium text-sm text-foreground"
                )}>
                  <div className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
                  <span className="w-full">{walletAddress}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className={cn(
                  "px-4 py-2 rounded-xl",
                  "bg-pink-500 hover:bg-pink-600",
                  "text-white font-medium text-sm",
                  "transition-colors"
                )}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolkaHeader; 