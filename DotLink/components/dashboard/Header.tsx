import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";

interface HeaderProps {
  address?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function Header({
  address,
  onConnect,
  onDisconnect,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Dot Link Transfer</h1>

      {address ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <Button variant="outline" onClick={onDisconnect}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button onClick={onConnect}>
          <WalletIcon className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </header>
  );
}
