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
import { BlockType } from "@/constants/paths";

export const blocks: BlockType[] = [
  {
    id: "polkadot_transfer",
    name: "Transfer DOT",
    description: "Transfer DOT tokens to another account",
    color: "#E6007A",
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
        unit: "DOT"
      }
    ],
    compatibleWith: ["polkadot_approve", "polkadot_mint", "polkadot_burn"]
  },
  {
    id: "polkadot_approve",
    name: "Approve Spending",
    description: "Approve another account to spend DOT tokens on your behalf",
    color: "#E6007A",
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
        unit: "DOT"
      }
    ],
    compatibleWith: ["polkadot_transfer", "polkadot_mint", "polkadot_burn"]
  },
  {
    id: "polkadot_mint",
    name: "Mint DOT",
    description: "Mint new DOT tokens",
    color: "#E6007A",
    icon: PlusIcon,
    category: "contract",
    technology: "Transaction",
    inputs: [
      {
        type: "number",
        label: "Amount",
        placeholder: "Enter amount to mint",
        required: true,
        unit: "DOT"
      }
    ],
    compatibleWith: ["polkadot_transfer", "polkadot_approve", "polkadot_burn"]
  },
  {
    id: "polkadot_burn",
    name: "Burn DOT",
    description: "Burn existing DOT tokens",
    color: "#E6007A",
    icon: FireIcon,
    category: "contract",
    technology: "Transaction",
    inputs: [
      {
        type: "number",
        label: "Amount",
        placeholder: "Enter amount to burn",
        required: true,
        unit: "DOT"
      }
    ],
    compatibleWith: ["polkadot_transfer", "polkadot_approve", "polkadot_mint"]
  },
  {
    id: "polkadot_transfer_from",
    name: "Transfer From",
    description: "Transfer DOT tokens from one account to another using allowance",
    color: "#E6007A",
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
        unit: "DOT"
      }
    ],
    compatibleWith: ["polkadot_approve", "polkadot_balance_of", "polkadot_allowance"]
  },
  {
    id: "polkadot_balance_of",
    name: "Get Balance",
    description: "Get the DOT token balance of an account",
    color: "#E6007A",
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
    compatibleWith: ["polkadot_transfer", "polkadot_transfer_from", "polkadot_approve"]
  },
  {
    id: "polkadot_allowance",
    name: "Check Allowance",
    description: "Check how many DOT tokens a spender is allowed to spend on behalf of an owner",
    color: "#E6007A",
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
    compatibleWith: ["polkadot_approve", "polkadot_transfer_from"]
  },
  {
    id: "polkadot_total_supply",
    name: "Total Supply",
    description: "Get the total supply of DOT tokens",
    color: "#E6007A",
    icon: ChartBarIcon,
    category: "validation",
    technology: "Transaction",
    inputs: [],
    compatibleWith: ["polkadot_balance_of", "polkadot_transfer", "polkadot_mint", "polkadot_burn"]
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
