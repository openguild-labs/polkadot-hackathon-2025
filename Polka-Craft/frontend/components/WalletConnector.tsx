import { useConnect, useAccount, useDisconnect } from "@gobob/sats-wagmi";
import { Wallet, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

const WalletConnector: React.FC = () => {
  const { connectors, connect, isSuccess, error } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);

  const formatAddress = (address: string | undefined) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isSuccess && address) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-black font-bold text-sm border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {formatAddress(address)}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => disconnect()}
          className="bg-white border-2 border-black text-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-white hover:text-black hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all"
        >
          <LogOut size={18} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-white text-black border-2 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-white hover:text-black hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all"
          >
            <Wallet size={20} className="mr-2" />
            Connect Wallet
            <ChevronDown
              size={16}
              className={`ml-2 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] mt-2"
        >
          {connectors.map((connector) => (
            <DropdownMenuItem
              key={connector.id}
              onClick={() => {
                connect({ connector });
                setIsOpen(false);
              }}
              className="flex items-center gap-2 py-3 px-4 cursor-pointer hover:bg-gray-50 text-black rounded-lg mx-1 my-1 transition-colors"
            >
              <img
                src={`/wallets/${connector.name}.png`}
                alt={connector.name}
                className="w-5 h-5"
              />
              <span className="font-medium">
                {connector.name.split(" ")[0]}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {error && (
        <Alert
          variant="destructive"
          className="mt-2 border-2 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white text-black"
        >
          <AlertDescription className="font-medium">
            {error.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WalletConnector;
