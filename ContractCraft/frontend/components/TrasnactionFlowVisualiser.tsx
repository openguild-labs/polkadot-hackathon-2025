import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, AlertCircle, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ExecuteButton from "./ExecuteButton";
import TransactionDetails from "./TransactionDetails";
import { useAccount } from "@gobob/sats-wagmi";
import PSBTPreview from "./PSBTPreview";
export interface PSBTInput {
  nonWitnessUtxo: {
    version: number;
    segwitFlag: boolean;
    inputs: Array<{
      txid: string;
      index: number;
      finalScriptSig: string;
      sequence: number;
    }>;
    outputs: Array<{
      amount: string;
      script: string;
    }>;
    witnesses: Array<string[]>;
    lockTime: number;
  };
  witnessUtxo: {
    amount: string;
    script: string;
  };
}

export interface PSBTData {
  value: {
    global: {
      unsignedTx: {
        version: number;
        inputs: Array<{
          txid: string;
          index: number;
          finalScriptSig: string;
          sequence: number;
        }>;
        outputs: Array<{
          amount: string;
          script: string;
        }>;
        lockTime: number;
      };
    };
    inputs: PSBTInput[];
    outputs: Record<string, unknown>[];
  };
}

interface Log {
  message: string;
  timestamp: Date;
  type: "info" | "success" | "error";
}

interface TransactionFlowVisualizerProps {
  blocks: BlockType[];
  values: Record<string, Record<string, string>>;
}
interface Log {
  message: string;
  timestamp: Date;
  type: "info" | "success" | "error";
}

interface TransactionFlowVisualizerProps {
  blocks: BlockType[];
  values: Record<string, Record<string, string>>;
}

const TransactionFlowVisualizer: React.FC<TransactionFlowVisualizerProps> = ({
  blocks,
  values,
}) => {
  const { address: btcAddress } = useAccount();
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentPSBT, setCurrentPSBT] = useState<PSBTData | null>(null);

  const addLog = (
    message: string,
    type: "info" | "success" | "error" = "info"
  ) => {
    setLogs((prev) => [...prev, { message, timestamp: new Date(), type }]);
  };
  const renderBlockValues = (blockIndex: number) => {
    const blockValue = values[`chain-${blockIndex}`];
    if (!blockValue) return null;

    return (
      <div className="mt-2 text-sm space-y-1">
        {Object.entries(blockValue).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="opacity-75">{key}:</span>
            <span className="font-mono">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  const getFlowStatus = (
    blocks: BlockType[]
  ): {
    message: string;
    type: "warning" | "success" | "error";
  } => {
    const lastBlock = blocks[blocks.length - 1];

    if (lastBlock.category === "bridge") {
      return {
        message:
          "This flow ends with a bridge operation, which may require additional confirmation steps.",
        type: "warning",
      };
    }

    if (lastBlock.category === "defi") {
      return {
        message: "DeFi operations may be subject to slippage and price impact.",
        type: "warning",
      };
    }

    return {
      message: "This transaction flow is ready to be executed.",
      type: "success",
    };
  };
  return (
    <div className="space-y-6">
      {blocks.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className={cn(
                "border-2 border-black rounded-xl",
                "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
                "hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
                "hover:translate-y-[-2px]",
                "transition-all duration-300"
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blocks.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total operations in flow
                </p>
              </CardContent>
            </Card>

            {/* Transaction Logs Card */}
            <Card
              className={cn(
                "border-2 border-black rounded-xl col-span-2",
                "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
                "hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
                "hover:translate-y-[-2px]",
                "transition-all duration-300"
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Transaction Logs
                </CardTitle>
                {logs.length > 0 && (
                  <button
                    onClick={() => setLogs([])}
                    className={cn(
                      "px-2 py-1 text-xs",
                      "bg-white border-2 border-black rounded-lg",
                      "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
                      "hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
                      "hover:translate-y-[-2px]",
                      "transition-all duration-200",
                      "flex items-center gap-1"
                    )}
                  >
                    <RotateCcw size={12} />
                    Clear
                  </button>
                )}
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-24 w-full rounded-lg border-2 border-black p-2">
                  {logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                      No transaction logs yet
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {logs.map((log, index) => (
                        <div
                          key={index}
                          className={cn(
                            "font-mono text-xs p-2 rounded border-2 border-black",
                            "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
                            log.type === "error" && "bg-red-50",
                            log.type === "success" && "bg-green-50",
                            log.type === "info" && "bg-blue-50"
                          )}
                        >
                          <span className="text-gray-500">
                            [{log.timestamp.toLocaleTimeString()}]
                          </span>{" "}
                          {log.message}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          {blocks[0]?.technology === "BOB Gateway" && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Transaction Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <PSBTPreview values={values} btcAddress={btcAddress || ""} />
              </CardContent>
            </Card>
          )}
          <Card
            className={cn(
              "border-2 border-black rounded-xl",
              "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
              "hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
              "hover:translate-y-[-2px]",
              "transition-all duration-300"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transaction Flow</CardTitle>
              <ExecuteButton
                blocks={blocks}
                values={values}
                onLog={(message, type) => {
                  addLog(message, type);
                  if (message.includes("Signing PSBT")) {
                    try {
                      const psbtData: PSBTData = JSON.parse(
                        message.split("Signing PSBT: ")[1]
                      );
                      setCurrentPSBT(psbtData);
                    } catch (e) {
                      console.error("Failed to parse PSBT data:", e);
                      addLog("Failed to parse PSBT data", "error");
                    }
                  }
                }}
              />

              {currentPSBT && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Transaction Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransactionDetails psbtData={currentPSBT} />
                  </CardContent>
                </Card>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {blocks.map((block, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`p-4 rounded-lg bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex-1`}
                    >
                      <div className="flex items-center gap-2">
                        <block.icon size={16} className="text-black" />
                        <span className="font-medium">{block.name}</span>
                      </div>
                      {renderBlockValues(index)}
                    </div>
                    {index < blocks.length - 1 && (
                      <ArrowRightLeft className="text-black" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {currentPSBT && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionDetails psbtData={currentPSBT} />
              </CardContent>
            </Card>
          )}
          <Alert
            className={cn(
              "border-2 border-black rounded-xl",
              "shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            )}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{getFlowStatus(blocks).message}</AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
};

export default TransactionFlowVisualizer;
