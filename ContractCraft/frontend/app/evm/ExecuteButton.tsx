import React, { useState } from "react";
import { Play, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { getContract, prepareContractCall } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { BlockType } from "@/constants/paths";
import { client } from "@/provider";
import { useActiveAccount, useSendTransaction, useReadContract } from "thirdweb/react";

interface ExecuteButtonProps {
  blocks: BlockType[];
  values: Record<string, Record<string, string>>;
  onLog: (message: string, type: "info" | "success" | "error") => void;
}

const CONTRACT_ADDRESS = "0xF77564e712bA1855969A3928524612aAD39F0366";
const CONTRACT_ABI = [{ "constant": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "name_", "type": "string" }, { "indexed": false, "internalType": "string", "name": "symbol_", "type": "string" }, { "indexed": false, "internalType": "uint8", "name": "decimals_", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "totalSupply_", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "Approval", "payable": false, "type": "event" }, { "constant": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "Transfer", "payable": false, "type": "event" }, { "constant": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_owner", "type": "address" }, { "indexed": false, "internalType": "address", "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "mint", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }]

const ExecuteButton: React.FC<ExecuteButtonProps> = ({
  blocks,
  values,
  onLog,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const account = useActiveAccount();
  const { mutate: sendTransaction, data, status } = useSendTransaction();

  // Monitor transaction status and handle next block execution
  React.useEffect(() => {
    if (!isExecuting) return;

    if (status === "pending") {
      onLog("Waiting for wallet confirmation...", "info");
    } else if (status === "error") {
      setIsExecuting(false);
      onLog("Transaction failed", "error");
    } else if (status === "success" && data) {
      onLog(`Transaction confirmed! Hash: ${data.transactionHash}`, "success");
      
      // Move to next block if there are more
      if (currentBlockIndex < blocks.length - 1) {
        setCurrentBlockIndex(prev => prev + 1);
        executeBlock(currentBlockIndex + 1);
      } else {
        // All blocks completed
        setIsExecuting(false);
        setCurrentBlockIndex(0);
        toast({
          title: "Operations Complete",
          description: "All operations executed successfully",
        });
      }
    }
  }, [status, data, currentBlockIndex, blocks.length]);

  // Move contract initialization inside useEffect or memoize it
  const contract = React.useMemo(() => {
    try {
      if (!client) return null;
      return getContract({
        client,
        address: CONTRACT_ADDRESS,
        chain: polygonAmoy,
        abi: CONTRACT_ABI as any,
      });
    } catch (error) {
      console.error("Contract initialization error:", error);
      return null;
    }
  }, []);

  const executeBlock = async (blockIndex: number) => {
    const block = blocks[blockIndex];
    const blockValues = values[`chain-${blockIndex}`] || {};

    onLog(`Executing ${block.name}...`, "info");

    try {
      switch (block.id) {
        case "evm_mint":
          if (!blockValues["Account Address"] || !blockValues["Amount"]) {
            throw new Error("Missing required parameters for mint");
          }
          sendTransaction(prepareContractCall({
            contract: contract!,
            method: "function mint(address _to, uint256 _value)",
            params: [blockValues["Account Address"], BigInt(blockValues["Amount"])],
          }));
          break;
        case "evm_transfer":
          if (!blockValues["Recipient Address"] || !blockValues["Amount"]) {
            throw new Error("Missing required parameters for transfer");
          }
          sendTransaction(prepareContractCall({
            contract: contract!,
            method: "function transfer(address _to, uint256 _value)",
            params: [blockValues["Recipient Address"], BigInt(blockValues["Amount"])],
          }));
          break;
        case "evm_approve":
          if (!blockValues["Spender Address"] || !blockValues["Amount"]) {
            throw new Error("Missing required parameters for approve");
          }
          sendTransaction(prepareContractCall({
            contract: contract!,
            method: "function approve(address _spender, uint256 _value)",
            params: [blockValues["Spender Address"], BigInt(blockValues["Amount"])],
          }));
          break;
        case "evm_burn":
          if (!blockValues["Amount"]) {
            throw new Error("Missing required parameters for burn");
          }
          sendTransaction(prepareContractCall({
            contract: contract!,
            method: "function burn(uint256 _value)",
            params: [BigInt(blockValues["Amount"])],
          }));
          break;
        case "evm_transfer_from":
          if (!blockValues["From Address"] || !blockValues["To Address"] || !blockValues["Amount"]) {
            throw new Error("Missing required parameters for transferFrom");
          }
          sendTransaction(prepareContractCall({
            contract: contract!,
            method: "function transferFrom(address _from, address _to, uint256 _value)",
            params: [
              blockValues["From Address"],
              blockValues["To Address"],
              BigInt(blockValues["Amount"])
            ],
          }));
          break;
        case "evm_balance_of":
          if (!blockValues["Account Address"]) {
            throw new Error("Missing required parameters for balanceOf");
          }
          const { data: balance } = await useReadContract({
            contract: contract!,
            method: "function balanceOf(address _owner) view returns (uint256)",
            params: [blockValues["Account Address"]],
          });
          onLog(`Balance: ${balance?.toString()} TKN`, "success");
          // Move to next block immediately for read operations
          if (currentBlockIndex < blocks.length - 1) {
            setCurrentBlockIndex(prev => prev + 1);
            executeBlock(currentBlockIndex + 1);
          } else {
            setIsExecuting(false);
            setCurrentBlockIndex(0);
          }
          break;
        case "evm_allowance":
          if (!blockValues["Owner Address"] || !blockValues["Spender Address"]) {
            throw new Error("Missing required parameters for allowance");
          }
          const { data: allowance } = await useReadContract({
            contract: contract!,
            method: "function allowance(address _owner, address _spender) view returns (uint256)",
            params: [blockValues["Owner Address"], blockValues["Spender Address"]],
          });
          onLog(`Allowance: ${allowance?.toString()} TKN`, "success");
          break;
        case "evm_total_supply":
          const { data: totalSupply } = await useReadContract({
            contract: contract!,
            method: "function totalSupply() view returns (uint256)",
            params: [],
          });
          onLog(`Total Supply: ${totalSupply?.toString()} TKN`, "success");
          break;
        case "evm_decimals":
          const { data: decimals } = await useReadContract({
            contract: contract!,
            method: "function decimals() view returns (uint8)",
            params: [],
          });
          onLog(`Decimals: ${decimals?.toString()}`, "success");
          break;
        case "evm_name":
          const { data: name } = await useReadContract({
            contract: contract!,
            method: "function name() view returns (string)",
            params: [],
          });
          onLog(`Token Name: ${name}`, "success");
          break;
        case "evm_symbol":
          const { data: symbol } = await useReadContract({
            contract: contract!,
            method: "function symbol() view returns (string)",
            params: [],
          });
          onLog(`Token Symbol: ${symbol}`, "success");
          break;
        default:
          onLog(`Unknown block type: ${block.id}`, "error");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      onLog(`Error executing ${block.name}: ${errorMessage}`, "error");
      setIsExecuting(false);
      setCurrentBlockIndex(0);
      toast({
        title: "Operation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleExecute = async () => {
    if (!account?.address) {
      onLog("Connect your wallet to execute", "error");
      return;
    }
    if (!contract) {
      onLog("Contract not initialized", "error");
      return;
    }

    setIsExecuting(true);
    setCurrentBlockIndex(0);
    executeBlock(0);
  };

  return (
    <Button
      onClick={handleExecute}
      disabled={isExecuting || !contract}
      className={cn(
        "px-4 py-2 rounded-xl",
        "bg-pink-500 hover:bg-pink-600",
        "text-white font-medium text-sm",
        "transition-colors",
        (isExecuting || !contract) && "opacity-50 cursor-not-allowed"
      )}
    >
      {!contract ? (
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