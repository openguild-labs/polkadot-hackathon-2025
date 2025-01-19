// ExecuteButton.tsx
import React, { useState } from "react";
import { Play, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { BlockType } from "@/constants/paths";
import { StarKeyProvider } from "@/types/starkey";

export const SUPRA_TOKEN_CONTRACT = {
  address: "0x5c81634add84286cd674e62c1e3e9d7576b3e5cce5f41508aab836a629c0d0a",
  module: "MyToken",
};

export const createSupraTransactionData = (functionName: string, args: any[]) => {
  return {
    action: "createRawTransactionData",
    params: {
      contractAddress: SUPRA_TOKEN_CONTRACT.address,
      module: SUPRA_TOKEN_CONTRACT.module,
      function: functionName,
      args
    }
  };
};

interface ExecuteButtonProps {
  blocks: BlockType[];
  values: Record<string, Record<string, string>>;
  onLog: (message: string, type: "info" | "success" | "error") => void;
}

const ExecuteButton: React.FC<ExecuteButtonProps> = ({
  blocks,
  values,
  onLog,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [starkeyAddress, setStarkeyAddress] = React.useState<string | null>(null);

  const getStarkeyProvider = (): StarKeyProvider['supra'] | null => {
    if ('starkey' in window && window.starkey?.supra) {
      return window.starkey.supra;
    }
    return null;
  };

  // Add effect to monitor StarKey connection
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

  const handleExecute = async () => {
    if (!starkeyAddress) {
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
        onLog("Failed to connect wallet", "error");
        return;
      }
    }

    setIsExecuting(true);

    try {
      for (const block of blocks) {
        onLog(`Executing ${block.name}...`, "info");
        const blockIndex = blocks.indexOf(block);
        const blockValues = values[`chain-${blockIndex}`] || {};

        try {
          const provider = getStarkeyProvider();
          if (!provider) throw new Error("StarKey provider not found");

          // @ts-ignore
          window.meow = provider;

          if(!starkeyAddress) throw new Error("StarKey address not found");

          switch (block.id) {
            case "supra_transfer":
              if (!blockValues["Recipient Address"] || !blockValues["Amount"]) {
                throw new Error("Missing required parameters for transfer");
              }
              const transferData = await provider.createRawTransactionData({
                ...createSupraTransactionData("transfer", [
                  blockValues["Recipient Address"],
                  BigInt(blockValues["Amount"]).toString()
                ])
              });
              
              await provider.sendTransaction({
                from: starkeyAddress,
                to: SUPRA_TOKEN_CONTRACT.address,
                data: transferData,
                value: "0"
              });
              break;

            case "supra_mint":
              if (!blockValues["Recipient Address"] || !blockValues["Amount"]) {
                throw new Error("Missing required parameters for mint");
              }
              const mintData = await provider.createRawTransactionData({
                ...createSupraTransactionData("mint", [
                  blockValues["Recipient Address"],
                  BigInt(blockValues["Amount"]).toString()
                ])
              });
              
              await provider.sendTransaction({
                from: starkeyAddress,
                to: SUPRA_TOKEN_CONTRACT.address,
                data: mintData,
                value: "0"
              });
              break;

            case "supra_balance_of":
              if (!blockValues["Account Address"]) {
                throw new Error("Missing account address for balance check");
              }
              const balanceData = await provider.createRawTransactionData({
                ...createSupraTransactionData("balance_of", [
                  blockValues["Account Address"]
                ])
              });
              
              await provider.sendTransaction({
                from: starkeyAddress,
                to: SUPRA_TOKEN_CONTRACT.address,
                data: balanceData,
                value: "0"
              });
              break;

            case "supra_publish_balance":
              const publishData = await provider.createRawTransactionData({
                ...createSupraTransactionData("publish_balance", [])
              });
              
              await provider.sendTransaction({
                from: starkeyAddress,
                to: SUPRA_TOKEN_CONTRACT.address,
                data: publishData,
                value: "0"
              });
              break;

            default:
              onLog(`Unknown block type: ${block.id}`, "error");
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
          onLog(`Error executing ${block.name}: ${errorMessage}`, "error");
          throw error;
        }
      }

      toast({
        title: "Operations Complete",
        description: "All operations executed successfully",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Operation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Button
      onClick={handleExecute}
      disabled={isExecuting}
      className={cn(
        "px-4 py-2 rounded-xl",
        "bg-pink-500 hover:bg-pink-600",
        "text-white font-medium text-sm",
        "transition-colors",
        isExecuting && "opacity-50 cursor-not-allowed"
      )}
    >
      {!starkeyAddress ? (
        <>
          <Wallet size={20} className="mr-2" />
          Connect StarKey to Execute
        </>
      ) : isExecuting ? (
        <>
          <Loader2 size={20} className="mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Play size={20} className="mr-2" />
          Execute Transaction
        </>
      )}
    </Button>
  );
};

export default ExecuteButton;
