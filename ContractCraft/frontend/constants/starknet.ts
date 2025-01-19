import {
    ArrowRightIcon,
    FireIcon,
    PlusIcon,
    MinusIcon,
    ArrowsRightLeftIcon,
    CheckIcon,
    WalletIcon
} from "@heroicons/react/24/outline";
import { BlockType } from "@/constants/paths";

export const blocks: BlockType[] = [
    {
        id: "starknet_mint",
        name: "Mint Tokens",
        description: "Mint new tokens to a specified address",
        color: "#1E293B", // Starknet theme color
        icon: PlusIcon,
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
                placeholder: "Enter amount to mint",
                required: true,
                unit: "Tokens"
            }
        ],
        compatibleWith: ["starknet_transfer", "starknet_burn"]
    },
    {
        id: "starknet_burn",
        name: "Burn Tokens",
        description: "Burn tokens from your account",
        color: "#1E293B",
        icon: FireIcon,
        category: "defi",
        technology: "Transaction",
        inputs: [
            {
                type: "number",
                label: "Amount",
                placeholder: "Enter amount to burn",
                required: true,
                unit: "Tokens"
            }
        ],
        compatibleWith: ["starknet_mint", "starknet_transfer"]
    },
    {
        id: "starknet_transfer",
        name: "Transfer Tokens",
        description: "Transfer tokens to another address",
        color: "#1E293B",
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
                unit: "Tokens"
            }
        ],
        compatibleWith: ["starknet_approve", "starknet_transferFrom"]
    },
    {
        id: "starknet_transfer_from",
        name: "Transfer From",
        description: "Transfer tokens from one address to another",
        color: "#1E293B",
        icon: ArrowsRightLeftIcon,
        category: "defi",
        technology: "Transaction",
        inputs: [
            {
                type: "address",
                label: "Sender Address",
                placeholder: "Enter sender address",
                required: true
            },
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
                unit: "Tokens"
            }
        ],
        compatibleWith: ["starknet_approve", "starknet_transfer"]
    },
    {
        id: "starknet_approve",
        name: "Approve Spender",
        description: "Approve an address to spend tokens on your behalf",
        color: "#1E293B",
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
                unit: "Tokens"
            }
        ],
        compatibleWith: ["starknet_transfer", "starknet_transferFrom"]
    },
    {
        id: "starknet_transfer_from_alt",
        name: "Transfer From (Alternative)",
        description: "Alternative method to transfer tokens between addresses",
        color: "#1E293B",
        icon: ArrowsRightLeftIcon,
        category: "defi",
        technology: "Transaction",
        inputs: [
            {
                type: "address",
                label: "Sender Address",
                placeholder: "Enter sender address",
                required: true
            },
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
                unit: "Tokens"
            }
        ],
        compatibleWith: ["starknet_approve", "starknet_transfer"]
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
