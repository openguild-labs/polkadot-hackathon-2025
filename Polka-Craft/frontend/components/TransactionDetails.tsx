import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionDetailsProps {
  psbtData: {
    value: {
      global: {
        unsignedTx: {
          version: number;
          inputs: Array<{
            txid: string;
            index: number;
            sequence: number;
          }>;
          outputs: Array<{
            amount: string;
            script: string;
          }>;
          lockTime: number;
        };
      };
    };
  };
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  psbtData,
}) => {
  const { unsignedTx } = psbtData.value.global;

  // Convert satoshis to BTC
  const formatBTC = (satoshis: string) => {
    return (parseInt(satoshis) / 100000000).toFixed(8);
  };

  // Format transaction ID
  const formatTxId = (txid: string) => {
    return `${txid.slice(0, 6)}...${txid.slice(-6)}`;
  };

  // Determine output type based on script
  const getOutputType = (script: string) => {
    if (script.startsWith("6a")) return "OP_RETURN (Data)";
    if (script.startsWith("0014")) return "P2WPKH (Witness)";
    return "Unknown";
  };

  return (
    <Card
      className={cn(
        "border-2 border-black rounded-xl",
        "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
        "transition-all duration-300"
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Transaction Preview</span>
          <span className="text-xs font-normal text-gray-500">
            (Version {unsignedTx.version})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Inputs</h3>
          <ScrollArea className="h-auto max-h-48">
            {unsignedTx.inputs.map((input, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border-2 border-black mb-2",
                  "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
                  "bg-blue-50"
                )}
              >
                <div className="text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">TXID:</span>
                    <span>{formatTxId(input.txid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Output Index:</span>
                    <span>{input.index}</span>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="text-gray-400" />
        </div>

        {/* Outputs */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Outputs</h3>
          <ScrollArea className="h-auto max-h-48">
            {unsignedTx.outputs.map((output, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border-2 border-black mb-2",
                  "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
                  output.amount === "0" ? "bg-gray-50" : "bg-green-50"
                )}
              >
                <div className="text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span>{formatBTC(output.amount)} BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span>{getOutputType(output.script)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Script:</span>
                    <span className="text-xs">
                      {output.script.slice(0, 10)}...
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Summary */}
        <div
          className={cn(
            "p-3 rounded-lg border-2 border-black",
            "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
            "bg-yellow-50"
          )}
        >
          <h3 className="text-sm font-semibold mb-2">Transaction Summary</h3>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Total Outputs:</span>
              <span>
                {unsignedTx.outputs.reduce(
                  (acc, out) => acc + parseInt(out.amount),
                  0
                ) / 100000000}{" "}
                BTC
              </span>
            </div>
            <div className="flex justify-between">
              <span>Number of Inputs:</span>
              <span>{unsignedTx.inputs.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Number of Outputs:</span>
              <span>{unsignedTx.outputs.length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
