// ExecuteButton.tsx
import React, { useState } from "react";
import { Play, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';

interface ExecuteButtonProps {
  blocks: BlockType[];
  values: Record<string, Record<string, string>>;
  onLog: (message: string, type: "info" | "success" | "error") => void;
  wallet: {
    address: string | null;
    instance: any;
  };
}

const CONTRACT_ADDRESS = "14xwNWLysQ6m9bwEPuuydMkvtbmVQukYgmjYLzouVF1JowHr";

const ExecuteButton: React.FC<ExecuteButtonProps> = ({
  blocks,
  values,
  onLog,
  wallet
}) => {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    if (!wallet.address || !wallet.instance) {
      onLog("Please connect your wallet first", "error");
      return;
    }

    setIsExecuting(true);

    try {
      // Get the API instance from the wallet
      const api = wallet.instance;
      
      // Get the injector for the connected account
      const injector = await web3FromAddress(wallet.address);

      for (const block of blocks) {
        onLog(`Executing ${block.name}...`, "info");
        
        const blockIndex = blocks.indexOf(block);
        const blockValues = values[`chain-${blockIndex}`] || {};

        switch (block.id) {
          case "polkadot_transfer":
            try {
              const tx = api.tx.contracts.call(
                CONTRACT_ADDRESS,
                0, // value
                null, // gas limit (null means automatic)
                null, // storage deposit limit (null means automatic)
                {
                  transfer: {
                    to: blockValues["Recipient Address"],
                    value: blockValues["Amount"]
                  }
                }
              );

              const result = await tx.signAndSend(
                wallet.address,
                { signer: injector.signer }
              );

              onLog(`Transfer submitted with hash: ${result.hash.toHex()}`, "success");
            } catch (error) {
              onLog(`Transfer failed: ${error}`, "error");
            }
            break;

          case "polkadot_approve":
            try {
              const tx = api.tx.contracts.call(
                CONTRACT_ADDRESS,
                0,
                null,
                null, // Add storage deposit limit parameter
                {
                  approve: {
                    spender: blockValues["Spender Address"],
                    value: blockValues["Amount"]
                  }
                }
              );

              const result = await tx.signAndSend(
                wallet.address,
                { signer: injector.signer }
              );

              onLog(`Approval submitted with hash: ${result.hash.toHex()}`, "success");
            } catch (error) {
              onLog(`Approval failed: ${error}`, "error");
            }
            break;

          case "polkadot_mint":
            try {
              const tx = api.tx.contracts.call(
                CONTRACT_ADDRESS,
                0,
                null,
                null, // Add storage deposit limit parameter
                {
                  mint: {
                    value: blockValues["Amount"]
                  }
                }
              );

              const result = await tx.signAndSend(
                wallet.address,
                { signer: injector.signer }
              );

              onLog(`Mint submitted with hash: ${result.hash.toHex()}`, "success");
            } catch (error) {
              onLog(`Mint failed: ${error}`, "error");
            }
            break;

          case "polkadot_burn":
            try {
              const tx = api.tx.contracts.call(
                CONTRACT_ADDRESS,
                0,
                null,
                null, // Add storage deposit limit parameter
                {
                  burn: {
                    value: blockValues["Amount"]
                  }
                }
              );

              const result = await tx.signAndSend(
                wallet.address,
                { signer: injector.signer }
              );

              onLog(`Burn submitted with hash: ${result.hash.toHex()}`, "success");
            } catch (error) {
              onLog(`Burn failed: ${error}`, "error");
            }
            break;

          default:
            onLog(`Unknown block type: ${block.id}`, "error");
        }
      }

      toast({
        title: "Transaction Complete",
        description: "All operations executed successfully",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      onLog(`Error: ${errorMessage}`, "error");

      toast({
        title: "Transaction Failed",
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
      disabled={isExecuting || !wallet.address}
      className={cn(
        "px-4 py-2 rounded-xl",
        "bg-pink-500 hover:bg-pink-600",
        "text-white font-medium text-sm",
        "transition-colors",
        (isExecuting || !wallet.address) && "opacity-50 cursor-not-allowed"
      )}
    >
      {!wallet.address ? (
        <>
          <Wallet size={20} className="mr-2" />
          Connect Wallet to Execute
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
