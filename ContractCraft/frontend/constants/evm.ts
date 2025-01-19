import { BlockType } from "@/constants/paths";
import { 
  ArrowRightIcon, 
  CheckIcon, 
  PlusIcon, 
  FireIcon, 
  ArrowsRightLeftIcon, 
  WalletIcon, 
  LockOpenIcon, 
  ChartBarIcon, 
  CalculatorIcon, 
  DocumentTextIcon, 
  TagIcon 
} from "@heroicons/react/24/outline";

export const blocks: BlockType[] = [
  {
    id: "evm_transfer",
    name: "Transfer TKN",
    description: "Transfer TKN tokens to another account",
    color: "#627EEA",
    icon: ArrowRightIcon,
    category: "defi",
    technology: "Transaction",
    inputs: [
      {
        type: "address",
        label: "Recipient Address",
        placeholder: "Enter recipient address",
        required: true
      },
      {
        type: "number",
        label: "Amount",
        placeholder: "Enter amount to transfer",
        required: true,
        unit: "TKN"
      }
    ],
    compatibleWith: ["evm_approve", "evm_mint", "evm_burn"]
  },
  {
    id: "evm_approve",
    name: "Approve Spending",
    description: "Approve another account to spend TKN tokens on your behalf",
    color: "#627EEA",
    icon: CheckIcon,
    category: "defi",
    technology: "Transaction",
    inputs: [
      {
        type: "address",
        label: "Spender Address",
        placeholder: "Enter spender address",
        required: true
      },
      {
        type: "number",
        label: "Amount",
        placeholder: "Enter amount to approve",
        required: true,
        unit: "TKN"
      }
    ],
    compatibleWith: ["evm_transfer", "evm_mint", "evm_burn"]
  },
  {
    id: "evm_mint",
    name: "Mint TKN",
    description: "Mint new TKN tokens",
    color: "#627EEA",
    icon: PlusIcon,
    category: "contract",
    technology: "Transaction",
    inputs: [
      {
        type: "address",
        label: "Account Address",
        placeholder: "Enter account address",
        required: true
      },
      {
        type: "number",
        label: "Amount",
        placeholder: "Enter amount to mint",
        required: true,
        unit: "TKN"
      }
    ],
    compatibleWith: ["evm_transfer", "evm_approve", "evm_burn"]
  },
  {
    id: "evm_burn",
    name: "Burn TKN",
    description: "Burn existing TKN tokens",
    color: "#627EEA",
    icon: FireIcon,
    category: "contract",
    technology: "Transaction",
    inputs: [
      {
        type: "number",
        label: "Amount",
        placeholder: "Enter amount to burn",
        required: true,
        unit: "TKN"
      }
    ],
    compatibleWith: ["evm_transfer", "evm_approve", "evm_mint"]
  },
  {
    id: "evm_transfer_from",
    name: "Transfer From",
    description: "Transfer TKN tokens from one account to another using allowance",
    color: "#627EEA",
    icon: ArrowsRightLeftIcon,
    category: "defi",
    technology: "Transaction",
    inputs: [
      {
        type: "address",
        label: "From Address",
        placeholder: "Enter source address",
        required: true
      },
      {
        type: "address",
        label: "To Address",
        placeholder: "Enter destination address",
        required: true
      },
      {
        type: "number",
        label: "Amount",
        placeholder: "Enter amount to transfer",
        required: true,
        unit: "TKN"
      }
    ],
    compatibleWith: ["evm_approve", "evm_balance_of", "evm_allowance"]
  },
  {
    id: "evm_balance_of",
    name: "Get Balance",
    description: "Get the TKN token balance of an account",
    color: "#627EEA",
    icon: WalletIcon,
    category: "validation",
    technology: "Transaction",
    inputs: [
      {
        type: "address",
        label: "Account Address",
        placeholder: "Enter account address",
        required: true
      }
    ],
    compatibleWith: ["evm_transfer", "evm_transfer_from", "evm_approve"]
  },
  {
    id: "evm_allowance",
    name: "Check Allowance",
    description: "Check how many TKN tokens a spender is allowed to spend on behalf of an owner",
    color: "#627EEA",
    icon: LockOpenIcon,
    category: "validation",
    technology: "Transaction",
    inputs: [
      {
        type: "address",
        label: "Owner Address",
        placeholder: "Enter owner address",
        required: true
      },
      {
        type: "address",
        label: "Spender Address",
        placeholder: "Enter spender address",
        required: true
      }
    ],
    compatibleWith: ["evm_approve", "evm_transfer_from"]
  },
  {
    id: "evm_total_supply",
    name: "Total Supply",
    description: "Get the total supply of TKN tokens",
    color: "#627EEA",
    icon: ChartBarIcon,
    category: "validation",
    technology: "Transaction",
    inputs: [],
    compatibleWith: ["evm_balance_of", "evm_transfer", "evm_mint", "evm_burn"]
  },
  {
    id: "evm_decimals",
    name: "Get Decimals",
    description: "Get the number of decimals for the token",
    color: "#627EEA",
    icon: CalculatorIcon,
    category: "validation",
    technology: "Transaction",
    inputs: [],
    compatibleWith: ["evm_transfer", "evm_mint", "evm_burn"]
  },
  {
    id: "evm_name",
    name: "Get Name",
    description: "Get the name of the token",
    color: "#627EEA",
    icon: DocumentTextIcon,
    category: "validation",
    technology: "Transaction",
    inputs: [],
    compatibleWith: ["evm_symbol", "evm_decimals"]
  },
  {
    id: "evm_symbol",
    name: "Get Symbol",
    description: "Get the symbol of the token",
    color: "#627EEA",
    icon: TagIcon,
    category: "validation",
    technology: "Transaction",
    inputs: [],
    compatibleWith: ["evm_name", "evm_decimals"]
  }
];

// Helper function to get blocks by technology
export const getBlocksByTechnology = (technology: BlockType["technology"]) => {
  return blocks.filter((block) => block.technology === technology);
};

// Helper function to get all available technologies
export const getAvailableTechnologies = (): BlockType["technology"][] => {
  return Array.from(new Set(blocks.map((block) => block.technology)));
};
