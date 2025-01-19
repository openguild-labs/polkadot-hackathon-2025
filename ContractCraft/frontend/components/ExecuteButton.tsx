// ExecuteButton.tsx
import React from "react";
import { Play, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useBobGateway } from "@/services/bobGateway";
import { useAccount } from "@gobob/sats-wagmi";
import { cn } from "@/lib/utils";

interface ExecuteButtonProps {
  blocks: BlockType[];
  values: Record<string, Record<string, string>>;
  onLog?: (message: string, type: "info" | "success" | "error") => void;
}

const ExecuteButton: React.FC<ExecuteButtonProps> = ({
  blocks,
  values,
  onLog,
}) => {
  const { executePath, isExecuting } = useBobGateway();
  const { address: btcAddress } = useAccount();

  const handleExecute = async () => {
    if (!btcAddress) {
      onLog?.("Wallet not connected", "error");
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Bitcoin wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      onLog?.(`Starting execution with address: ${btcAddress}`, "info");
      const result = await executePath(blocks, values);

      if (result.insufficientFunds) {
        onLog?.(
          `Insufficient funds - Required: ${result.requiredAmount} BTC, Available: ${result.balance} BTC`,
          "error"
        );
        toast({
          title: "Insufficient Balance",
          description: (
            <div className="mt-2 space-y-2">
              <div className="text-sm font-mono mt-1 space-y-1">
                <p>Required: {result.requiredAmount?.toFixed(8)} BTC</p>
                <p>Available: {result.balance?.toFixed(8)} BTC</p>
              </div>
            </div>
          ),
          variant: "destructive",
        });
        return;
      }

      if (result.success) {
        onLog?.(`Transaction submitted with hash: ${result.txHash}`, "success");
        toast({
          title: "Transaction Submitted!",
          description: (
            <div className="mt-2 space-y-2">
              <p>Your transaction has been submitted successfully.</p>
              {result.txHash && (
                <p className="font-mono text-xs break-all">
                  Hash: {result.txHash}
                </p>
              )}
            </div>
          ),
        });
      } else {
        onLog?.(`Transaction failed: ${result.error}`, "error");
        toast({
          title: "Transaction Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      onLog?.(`Execution error: ${errorMessage}`, "error");
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      size="lg"
      onClick={handleExecute}
      disabled={isExecuting || !btcAddress}
      className={cn(
        "bg-black text-white border-2 border-black rounded-xl",
        "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
        "hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
        "hover:translate-y-[-2px]",
        "transition-all duration-200",
        "flex items-center gap-2",
        (!btcAddress || isExecuting) && "opacity-50 cursor-not-allowed"
      )}
    >
      {!btcAddress ? (
        <>
          <Wallet size={20} />
          Connect Wallet
        </>
      ) : isExecuting ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Play size={20} />
          Execute Flow
        </>
      )}
    </Button>
  );
};

export default ExecuteButton;
