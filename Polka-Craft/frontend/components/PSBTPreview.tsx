// PSBTPreview.tsx
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  WalletCards,
  Send,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface PSBTPreviewProps {
  values: Record<string, Record<string, string>>;
  btcAddress: string;
}

interface ValidationStatus {
  address: boolean;
  amount: boolean;
  message: string;
}

const PSBTPreview: React.FC<PSBTPreviewProps> = ({ values, btcAddress }) => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({
    address: false,
    amount: false,
    message: "",
  });

  const firstBlockValues = values["chain-0"] || {};
  const amount = parseFloat(firstBlockValues.Amount || "0");
  const bobAddress = firstBlockValues["BOB Address"] || "";
  const satoshis = Math.floor(amount * 100000000);
  const gasRefill = 10000; // 0.0001 BTC for gas

  useEffect(() => {
    // Validate as user types
    const newValidation = {
      address: bobAddress.startsWith("0x"),
      amount: amount > 0 && satoshis >= 1000,
      message: "",
    };

    if (!bobAddress) {
      newValidation.message = "Waiting for BOB address...";
    } else if (!newValidation.address) {
      newValidation.message = "BOB address must start with 0x";
    } else if (!amount) {
      newValidation.message = "Waiting for amount...";
    } else if (satoshis < 1000) {
      newValidation.message = "Amount must be at least 0.00001 BTC (1000 sats)";
    } else {
      newValidation.message = "Transaction details complete";
    }

    setValidationStatus(newValidation);
  }, [amount, bobAddress, satoshis]);

  const ValidationIndicator = ({
    valid,
    label,
  }: {
    valid: boolean;
    label: string;
  }) => (
    <div className="flex items-center gap-2 text-sm">
      {valid ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-gray-300" />
      )}
      <span className={valid ? "text-green-700" : "text-gray-500"}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <Alert
        className={cn(
          "border-2 border-black",
          "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
          validationStatus.address && validationStatus.amount
            ? "bg-green-50"
            : "bg-yellow-50"
        )}
      >
        <div className="w-full space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">{validationStatus.message}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ValidationIndicator
              valid={validationStatus.address}
              label="Valid BOB Address"
            />
            <ValidationIndicator
              valid={validationStatus.amount}
              label="Valid Amount"
            />
          </div>
        </div>
      </Alert>

      {/* From Address Section */}
      <div
        className={cn(
          "p-4 rounded-lg border-2 border-black",
          "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
          "bg-blue-50",
          "transition-all duration-300"
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <WalletCards className="h-4 w-4" />
          <h3 className="font-semibold">Source</h3>
        </div>
        <div className="font-mono text-sm break-all">
          {btcAddress || "Connect wallet to see address"}
        </div>
      </div>

      {/* Live Preview Section */}
      <div
        className={cn(
          "p-4 rounded-lg border-2 border-black",
          "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
          "bg-yellow-50",
          "transition-all duration-300"
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <Send className="h-4 w-4" />
          <h3 className="font-semibold">Transaction Details</h3>
        </div>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between items-center">
            <span>Bridge Amount:</span>
            <span className={amount ? "text-black" : "text-gray-400"}>
              {amount
                ? `${amount.toFixed(8)} BTC (${satoshis} sats)`
                : "Waiting for amount..."}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Gas Refill:</span>
            <span>0.0001 BTC ({gasRefill} sats)</span>
          </div>
          <div className="flex justify-between items-center font-bold">
            <span>Total:</span>
            <span className={amount ? "text-black" : "text-gray-400"}>
              {amount
                ? `${((satoshis + gasRefill) / 100000000).toFixed(8)} BTC`
                : "Waiting for amount..."}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Destination:</span>
            <span className={bobAddress ? "text-black" : "text-gray-400"}>
              {bobAddress || "Waiting for address..."}
            </span>
          </div>
        </div>
      </div>

      {/* PSBT Structure Preview */}
      <div
        className={cn(
          "p-4 rounded-lg border-2 border-black",
          "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
          "bg-gray-50",
          "transition-all duration-300"
        )}
      >
        <h3 className="font-semibold mb-2">PSBT Structure</h3>
        <ScrollArea className="h-auto max-h-48">
          <div className="space-y-2 font-mono text-sm">
            <p>Version: 2</p>
            <div>
              <p>Outputs:</p>
              <div className="pl-4 space-y-1 opacity-75">
                <p>1. OP_RETURN (Bridge Data) {amount ? "✓" : "..."}</p>
                <p>2. Change Output {btcAddress ? "✓" : "..."}</p>
                <p>
                  3. Bridge Output:{" "}
                  {amount ? `${amount.toFixed(8)} BTC ✓` : "..."}
                </p>
              </div>
            </div>
            <div>
              <p>Required Signatures:</p>
              <div className="pl-4 opacity-75">
                <p>
                  • Wallet Signature{" "}
                  {btcAddress ? "(Ready)" : "(Waiting for wallet)"}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {validationStatus.address && validationStatus.amount && (
        <Alert
          className={cn(
            "border-2 border-black",
            "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
            "bg-green-50"
          )}
        >
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Transaction is ready to be signed. Please verify all details before
            proceeding.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PSBTPreview;
