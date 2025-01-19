import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, AlertCircle, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ExecuteButton from "./ExecuteButton";
import { getWallets } from "@talismn/connect-wallets";

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
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [talismanWallet, setTalismanWallet] = useState<any>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const initializeWallet = async () => {
      const installedWallets = getWallets().filter(
        (wallet) => wallet.installed
      );
      const wallet = installedWallets.find(
        (wallet) => wallet.extensionName === "talisman"
      );

      if (wallet) {
        try {
          await wallet.enable("ContractCraft");
          setTalismanWallet(wallet);
          wallet.subscribeAccounts((accounts) => {
            if (accounts && accounts.length > 0) {
              setWalletAddress(accounts[0].address);
              addLog(
                `Connected to wallet: ${accounts[0].address.slice(0, 8)}...`,
                "success"
              );
            } else {
              setWalletAddress(null);
              addLog("Wallet disconnected", "info");
            }
          });
        } catch (err) {
          console.error("Failed to connect to Talisman:", err);
          addLog("Failed to connect to wallet", "error");
        }
      }
    };

    initializeWallet();
  }, []);

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
      <div className="mt-1 text-xs space-y-0.5">
        {Object.entries(blockValue).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1">
            <span className="text-gray-400">{key}:</span>
            <span className="font-mono text-gray-300">{value}</span>
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

    if (lastBlock.category === "defi") {
      return {
        message:
          "This transaction may affect your DOT balance. Please review carefully.",
        type: "warning",
      };
    }

    if (lastBlock.category === "contract") {
      return {
        message:
          "This operation interacts with a Polkadot smart contract. Please verify the details.",
        type: "warning",
      };
    }

    if (lastBlock.category === "validation") {
      return {
        message:
          "This is a read-only operation that won't modify the blockchain state.",
        type: "success",
      };
    }

    return {
      message: "This transaction flow is ready to be executed.",
      type: "success",
    };
  };

  const renderTransactionPreview = () => {
    if (!blocks[0]) return null;

    return (
      <Card className="mb-3">
        <CardHeader className="py-2">
          <CardTitle className="text-sm">Transaction Preview</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">From:</span>
              <span className="font-mono">
                {walletAddress?.slice(0, 12) || "Not connected"}...
              </span>
            </div>
            {Object.entries(values).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between text-xs"
              >
                <span className="font-medium">{key}:</span>
                <span className="font-mono">
                  {Object.entries(value).map(([k, v]) => (
                    <div key={k}>
                      {k}: {v} {k.toLowerCase().includes("amount") ? "DOT" : ""}
                    </div>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {blocks.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card
              className={cn(
                "border-[0.5px] border-gray-800 rounded-lg",
                "bg-gray-900/50",
                "shadow-sm",
                "transition-all duration-200"
              )}
            >
              <CardHeader className="py-2">
                <CardTitle className="text-sm text-gray-300">Steps</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-lg font-bold text-gray-100">
                  {blocks.length}
                </div>
                <p className="text-xs text-gray-400">
                  Total operations in flow
                </p>
              </CardContent>
            </Card>

            <Card
              className={cn(
                "border-[0.5px] border-gray-800 rounded-lg col-span-2",
                "bg-gray-900/50",
                "shadow-sm",
                "transition-all duration-200"
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between py-2">
                <CardTitle className="text-sm text-gray-300">
                  Transaction Logs
                </CardTitle>
                {logs.length > 0 && (
                  <button
                    onClick={() => setLogs([])}
                    className="px-2 py-1 text-xs border-[0.5px] rounded-md bg-background flex items-center gap-1"
                  >
                    <RotateCcw size={8} />
                    Clear
                  </button>
                )}
              </CardHeader>
              <CardContent className="py-2">
                <ScrollArea className="h-20 w-full rounded-md border-[0.5px] border-gray-800 p-2">
                  {logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                      No transaction logs yet
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {logs.map((log, index) => (
                        <div
                          key={index}
                          className={cn(
                            "font-mono text-xs p-1.5 rounded border-[0.5px] border-gray-800",
                            log.type === "error" && "bg-red-500 text-red-200",
                            log.type === "success" && "bg-green-500 text-green-200",
                            log.type === "info" && "bg-blue-500 text-blue-200"
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

          {blocks[0]?.technology === "Transaction" &&
            renderTransactionPreview()}

          <Card
            className={cn(
              "border-[0.5px] border-gray-800 rounded-lg",
              "bg-gray-900/50",
              "shadow-sm",
              "transition-all duration-200"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between py-2">
              <CardTitle className="text-sm text-gray-300">
                Transaction Flow
              </CardTitle>
              <ExecuteButton blocks={blocks} values={values} onLog={addLog} />
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex flex-col gap-2">
                {blocks.map((block, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "p-2 rounded-md bg-gray-900/80 border-[0.5px] border-gray-800 flex-1",
                        "hover:bg-gray-800/50 transition-colors duration-200",
                        block.category === "defi" &&
                          "border-l-2 border-l-pink-500",
                        block.category === "contract" &&
                          "border-l-2 border-l-purple-500",
                        block.category === "validation" &&
                          "border-l-2 border-l-green-500"
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <block.icon size={10} className="text-gray-400 h-4 w-4" />
                        <span className="font-medium text-xs text-gray-300">
                          {block.name}
                        </span>
                      </div>
                      {renderBlockValues(index)}
                    </div>
                    {index < blocks.length - 1 && (
                      <ArrowRightLeft size={10} className="text-gray-600" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert
            className={cn(
              "border-[0.5px] rounded-lg",
              "bg-gray-900/50",
              getFlowStatus(blocks).type === "warning" &&
                "border-l-2 border-l-yellow-500 bg-yellow-950/30",
              getFlowStatus(blocks).type === "success" &&
                "border-l-2 border-l-green-500 bg-green-950/30",
              getFlowStatus(blocks).type === "error" &&
                "border-l-2 border-l-red-500 bg-red-950/30"
            )}
          >
            <AlertCircle className="h-3 w-3 text-gray-400" />
            <AlertDescription className="text-xs text-gray-300">
              {getFlowStatus(blocks).message}
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
};

export default TransactionFlowVisualizer;
