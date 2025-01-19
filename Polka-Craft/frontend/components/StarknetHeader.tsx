import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useConnect, useAccount, useInjectedConnectors, argent, braavos } from "@starknet-react/core";

const StarknetHeader = () => {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
  });
  const { connect } = useConnect({ });
  const { address, isConnected } = useAccount();

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
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAe1BMVEVHcEwMDE8MDE8MDE8MDE8MDE8LC08MDE8LC08MDE8AAk0JCk8AAEUAAD5QUHc6OGWkpLbT09z18vPk5eq8vMl5bor9///7+/smIVlZWX+MjKP53tvupZ3zfW3ykob0ta7scWHteGqkU170w77DZ2deMlbbcGk/IlJ9QVq6EZMHAAAACnRSTlMAT5jM7v8Zpo/l/+aYzwAAAWlJREFUeAGVk4UCwyAMRGupBKiXdu7y/184Apn7zfeO5DDvRn4QRgBRGPjeC8UJ3CiJH3kKD0rvh2fwpCy+4fBS8Rd+ddj6KICFUiklJXW5yYc5OIdQRVnVTdsp5KSx5arKJTkQW637vte6GdA1ofnjqNXNGATg0BAm6do4EmOwBYZxX3UU5My1USMBzPpy57aQ5r1iPpnOZvNpgeB7AUc3P0CVjuvFcrWarSUCBF4I7ACQI+Yby+3EQy+Cs3DgeDXxreUQeVcuOaCeGsOKSpLIIFEgqssEJ1RgxxyoRTcg5GXPvF7ZAMwjE9LOTVtMmhvD3gWwIQPAgiFJz6nBAYEV0ELJ7uKo5y4ACUi+Z1NuJ1prE2JjyhMXw3bvYrrNErieLzab6YqG7019XM9mezIkvN0CD1saa/4+Uu2LIeYDQ5bhuF4fD0j5qeSWgqY3Rw7QClj2a/ZwaMW/xzr+/eJ8u3pfLu+X638C0BIpiMYZMKIAAAAASUVORK5CYII=" width={28} height={28} alt="Supra Logo" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-xl tracking-tight text-foreground">
                ContractCraft
              </span>
              <span className="text-xs font-medium text-muted-foreground tracking-tight">
                Starknet Smart Contract Platform
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {isConnected && address ? (
              <div className="flex items-center gap-4">
                <div className={cn(
                  "hidden sm:flex items-center gap-2 px-4 py-2",
                  "bg-background/50 border border-primary/20 rounded-xl",
                  "backdrop-blur-md",
                  "font-medium text-sm text-foreground"
                )}>
                  <div className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
                  <span className="w-full">{address}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => connect({
                  connector: connectors[0]
                })}
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

export default StarknetHeader;