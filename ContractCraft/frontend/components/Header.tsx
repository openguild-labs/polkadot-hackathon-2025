"use client";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";

import { IconCurrencyEthereum } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { polygonAmoy } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: "c9c8224aed814544cf52b20807cfa50e",
});

const Header = () => {
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
              <IconCurrencyEthereum size={28} className="text-primary" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-xl tracking-tight text-foreground">
                ContractCraft
              </span>
              <span className="text-xs font-medium text-muted-foreground tracking-tight">
                Build Smart Contracts Visually
              </span>
            </div>
          </Link>

          {/* Network Status + Wallet */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "hidden sm:flex items-center gap-2 px-4 py-2",
                "bg-background/50 border border-primary/20 rounded-xl",
                "backdrop-blur-md",
                "font-medium text-sm text-foreground"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Testnet</span>
            </div>
            <ConnectButton
              client={client}
              connectModal={{ size: "wide" }}
              chain={polygonAmoy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;