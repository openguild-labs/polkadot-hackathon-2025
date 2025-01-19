import React, { useState } from "react";
import { Play, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { BlockType } from "@/constants/paths";
import { useAccount, useConnect, useContract, useSendTransaction } from "@starknet-react/core";
import type { Abi } from "starknet";

// Contract details
export const TOKEN_CONTRACT = {
  address: "0x05983fcb57607c664ec50542a68d9e9f96001e48a38e79cf284e764d601266a9",
  classHash: "0x0713fbf3b6a61d31fb0e6cd7a6738faa5a3791bea38804c9b7b65950f23579fd",
} as const;

// Simplified ABI for the functions we need
const abi = 
[
  {
    "name": "MyToken",
    "type": "impl",
    "interface_name": "erc20::IERC20MintingAndBurning"
  },
  {
    "name": "core::integer::u256",
    "type": "struct",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "name": "erc20::IERC20MintingAndBurning",
    "type": "interface",
    "items": [
      {
        "name": "mint",
        "type": "function",
        "inputs": [
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "burn",
        "type": "function",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "ERC20MixinImpl",
    "type": "impl",
    "interface_name": "openzeppelin_token::erc20::interface::ERC20ABI"
  },
  {
    "name": "core::bool",
    "type": "enum",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "name": "core::byte_array::ByteArray",
    "type": "struct",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "name": "openzeppelin_token::erc20::interface::ERC20ABI",
    "type": "interface",
    "items": [
      {
        "name": "total_supply",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "balance_of",
        "type": "function",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "allowance",
        "type": "function",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "spender",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "transfer",
        "type": "function",
        "inputs": [
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "transfer_from",
        "type": "function",
        "inputs": [
          {
            "name": "sender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "approve",
        "type": "function",
        "inputs": [
          {
            "name": "spender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "name",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "symbol",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "decimals",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u8"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "totalSupply",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "balanceOf",
        "type": "function",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "transferFrom",
        "type": "function",
        "inputs": [
          {
            "name": "sender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_token::erc20::erc20::ERC20Component::Transfer",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "from",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "to",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "value",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_token::erc20::erc20::ERC20Component::Approval",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "spender",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "value",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_token::erc20::erc20::ERC20Component::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Transfer",
        "type": "openzeppelin_token::erc20::erc20::ERC20Component::Transfer"
      },
      {
        "kind": "nested",
        "name": "Approval",
        "type": "openzeppelin_token::erc20::erc20::ERC20Component::Approval"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "erc20::MyToken::Event",
    "type": "event",
    "variants": [
      {
        "kind": "flat",
        "name": "ERC20Event",
        "type": "openzeppelin_token::erc20::erc20::ERC20Component::Event"
      }
    ]
  }
] as const satisfies Abi;

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
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { contract } = useContract({
    address: TOKEN_CONTRACT.address,
    abi: abi,
  });

  const { data, send: sendTransaction } = useSendTransaction({

  });

  const handleExecute = async () => {
    if (!isConnected || !address) {
      const connector = connectors[0];
      if (connector) {
        try {
          await connect({ connector });
        } catch (err) {
          console.error("Failed to connect wallet:", err);
          onLog("Failed to connect wallet", "error");
          return;
        }
      }
      return;
    }

    setIsExecuting(true);

    try {
      for (const block of blocks) {
        onLog(`Executing ${block.name}...`, "info");
        const blockIndex = blocks.indexOf(block);
        const blockValues = values[`chain-${blockIndex}`] || {};

        if (!contract) throw new Error("Contract not initialized");

        try {
          switch (block.id) {
            case "supra_transfer":
              if (!blockValues["Recipient Address"] || !blockValues["Amount"]) {
                throw new Error("Missing required parameters for transfer");
              }
              
              await sendTransaction([
                  contract.populateTransaction.transfer(
                    blockValues["Recipient Address"],
                    { low: BigInt(blockValues["Amount"]), high: 0 }
                )
              ]);
              break;

            case "supra_mint":
              if (!blockValues["Recipient Address"] || !blockValues["Amount"]) {
                throw new Error("Missing required parameters for mint");
              }
              
              await sendTransaction([
                  contract.populateTransaction.mint(
                    blockValues["Recipient Address"],
                    { low: BigInt(blockValues["Amount"]), high: 0 }
                  )
              ]);
              break;

            case "supra_balance_of":
              if (!blockValues["Account Address"]) {
                throw new Error("Missing account address for balance check");
              }
              
              const balance = await contract.balance_of(blockValues["Account Address"]);
              onLog(`Balance: ${balance.toString()}`, "success");
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
      {!isConnected ? (
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
