import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, AlertCircle, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ExecuteButton from "./ExecuteButton";
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';

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
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        // Initialize the provider with the custom endpoint
        const provider = new WsProvider('wss://rpc1.paseo.popnetwork.xyz');
        
        // Create the API instance
        const api = await ApiPromise.create({ provider });
        setApi(api);

        // Enable the extension
        const extensions = await web3Enable('ContractCraft');
        
        if (extensions.length === 0) {
          addLog("No Polkadot extension found. Please install it.", "error");
          return;
        }

        // Get all accounts from the extension
        const accounts = await web3Accounts();
        
        if (accounts.length > 0) {
          setWalletAddress(accounts[0].address);
          addLog(`Connected to wallet: ${accounts[0].address.slice(0, 8)}...`, "success");
        } else {
          addLog("No accounts found in the Polkadot extension", "error");
        }

        // Get chain info
        const [chain, nodeName, nodeVersion] = await Promise.all([
          api.rpc.system.chain(),
          api.rpc.system.name(),
          api.rpc.system.version()
        ]);

        addLog(`Connected to ${chain} using ${nodeName} v${nodeVersion}`, "info");
      } catch (err) {
        console.error("Failed to connect:", err);
        addLog("Failed to connect to Polkadot extension", "error");
      }
    };

    initializeWallet();

    // Cleanup function
    return () => {
      if (api) {
        api.disconnect();
      }
    };
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

    if (lastBlock.category === "defi") {
      return {
        message: "This transaction may affect your DOT balance. Please review carefully.",
        type: "warning",
      };
    }

    if (lastBlock.category === "contract") {
      return {
        message: "This operation interacts with a Polkadot smart contract. Please verify the details.",
        type: "warning",
      };
    }

    if (lastBlock.category === "validation") {
      return {
        message: "This is a read-only operation that won't modify the blockchain state.",
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
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Transaction Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">From:</span>
              <span className="font-mono text-sm">{walletAddress || 'Not connected'}</span>
            </div>
            {Object.entries(values).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium">{key}:</span>
                <span className="font-mono text-sm">
                  {Object.entries(value).map(([k, v]) => (
                    <div key={k}>
                      {k}: {v} {k.toLowerCase().includes('amount') ? 'DOT' : ''}
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
                      "bg-background border-2 border-black rounded-lg",
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
                    <div className="flex items-center justify-center h-full text-gray-100 text-sm">
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
                            log.type === "error" && "bg-red-500",
                            log.type === "success" && "bg-green-500",
                            log.type === "info" && "bg-blue-500"
                          )}
                        >
                          <span className="text-gray-100">
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
          {blocks[0]?.technology === "Transaction" && renderTransactionPreview()}
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
                onLog={addLog}
                wallet={{
                  address: walletAddress,
                  instance: api
                }}
              />
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="flex items-center gap-4 pb-4 overflow-x-auto">
                  {blocks.map((block, index) => (
                    <div key={index} className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className={cn(
                          "p-4 rounded-lg bg-background border-2 border-black",
                          "shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex-1",
                          "hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
                          "hover:translate-y-[-2px]",
                          "transition-all duration-200 min-w-[300px]",
                          block.category === "defi" && "border-pink-500",
                          block.category === "contract" && "border-purple-500",
                          block.category === "validation" && "border-green-500"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <block.icon size={16} className="text-white h-4 w-4" />
                          <span className="font-medium">{block.name}</span>
                        </div>
                        {renderBlockValues(index)}
                      </div>
                      {index < blocks.length - 1 && (
                        <ArrowRightLeft className="text-white h-4 w-4 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Alert
            className={cn(
              "flex items-center gap-2 border-2 border-black rounded-xl",
              getFlowStatus(blocks).type === "warning" && "border-yellow-500 bg-yellow-500",
              getFlowStatus(blocks).type === "success" && "border-green-500 bg-green-500",
              getFlowStatus(blocks).type === "error" && "border-red-500 bg-red-500"
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
