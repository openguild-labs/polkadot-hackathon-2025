"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WalletIcon, LinkIcon } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const pathname = usePathname();
  const { address, connect, disconnect } = useWallet();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-8 h-24 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <LinkIcon className="h-8 w-8 text-primary" />
            <span className="font-black text-2xl text-foreground">
              Dot Link
            </span>
          </Link>

          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {address ? (
          <div className="flex items-center gap-6">
            <span className="text-lg text-muted-foreground">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full text-lg px-8 py-6"
              onClick={disconnect}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <>
            <ConnectButton />
            {/* <Button
              size="lg"
              className="rounded-full blob-button bg-primary text-primary-foreground text-lg px-8 py-6"
              onClick={connect}
            >
              <WalletIcon className="mr-3 h-6 w-6" />
              Connect Wallet
            </Button> */}
          </>
        )}
      </div>
    </nav>
  );
}
