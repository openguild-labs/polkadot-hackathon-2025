import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StarKeyProvider } from "@/types/starkey";

const MoveHeader = () => {
  const [starkeyAddress, setStarkeyAddress] = React.useState<string | null>(null);

  const getStarkeyProvider = (): StarKeyProvider['supra'] | null => {
    if ('starkey' in window && window.starkey?.supra) {
      return window.starkey.supra;
    }
    return null;
  };

  const connectStarkey = async () => {
    const provider = getStarkeyProvider();
    if (!provider) {
      window.open('https://starkey.app/', '_blank');
      return;
    }

    try {
      const accounts = await provider.connect();
      if (accounts[0]) {
        setStarkeyAddress(accounts[0]);
      }
    } catch (err) {
      console.error("Failed to connect to StarKey:", err);
    }
  };

  const disconnectStarkey = async () => {
    const provider = getStarkeyProvider();
    if (!provider) return;

    try {
      await provider.disconnect();
      setStarkeyAddress(null);
    } catch (err) {
      console.error("Failed to disconnect StarKey:", err);
    }
  };

  React.useEffect(() => {
    const provider = getStarkeyProvider();
    if (provider) {
      provider.on('accountChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setStarkeyAddress(accounts[0]);
        } else {
          setStarkeyAddress(null);
        }
      });
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-background backdrop-blur-md border-b border-primary/20">
      <div className="max-w-7xl mx-auto h-16 px-6">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Project Name */}
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
              <img src="https://supra.com/images/brand/SupraOracles-Red-Light-Symbol.svg" width={28} height={28} alt="Supra Logo" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-xl tracking-tight text-foreground">
                ContractCraft
              </span>
              <span className="text-xs font-medium text-muted-foreground tracking-tight">
                Move Smart Contract Platform
              </span>
            </div>
          </Link>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {starkeyAddress ? (
              <div className="flex items-center gap-4">
                <div className={cn(
                  "hidden sm:flex items-center gap-2 px-4 py-2",
                  "bg-background/50 border border-primary/20 rounded-xl",
                  "backdrop-blur-md",
                  "font-medium text-sm text-foreground"
                )}>
                  <div className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
                  <span className="w-full">{starkeyAddress}</span>
                </div>
                <button
                  onClick={disconnectStarkey}
                  className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectStarkey}
                className={cn(
                  "px-4 py-2 rounded-xl",
                  "bg-red-500 hover:bg-red-600",
                  "text-white font-medium text-sm",
                  "transition-colors"
                )}
              >
                Connect StarKey
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveHeader; 