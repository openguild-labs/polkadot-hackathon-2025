import { 
  ArrowRightIcon, 
  CheckIcon, 
  PlusIcon, 
  FireIcon, 
  ArrowsRightLeftIcon, 
  WalletIcon, 
  LockOpenIcon, 
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { BlockType } from "@/constants/paths";

export const blocks: BlockType[] = [
  {
    id: "supra_transfer",
    name: "Transfer SUPRA",
    description: "Transfer SUPRA tokens to another account",
    color: "#1E40AF", // Supra blue color
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
        unit: "SUPRA"
      }
    ],
    compatibleWith: ["supra_balance_of", "supra_approve"]
  },
  {
    id: "supra_mint",
    name: "Mint SUPRA",
    description: "Mint new SUPRA tokens (only module owner)",
    color: "#1E40AF",
    icon: PlusIcon,
    category: "contract",
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
        placeholder: "Enter amount to mint",
        required: true,
        unit: "SUPRA"
      }
    ],
    compatibleWith: ["supra_balance_of", "supra_transfer"]
  },
  {
    id: "supra_balance_of",
    name: "Get Balance",
    description: "Get the SUPRA token balance of an account",
    color: "#1E40AF",
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
    compatibleWith: ["supra_transfer", "supra_mint"]
  },
  {
    id: "supra_publish_balance",
    name: "Initialize Balance",
    description: "Initialize a balance resource for an account",
    color: "#1E40AF",
    icon: LockOpenIcon,
    category: "contract",
    technology: "Transaction",
    inputs: [],
    compatibleWith: ["supra_transfer", "supra_mint", "supra_balance_of"]
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
