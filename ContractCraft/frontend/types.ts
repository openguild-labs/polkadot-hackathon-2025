interface BlockType {
  id: string;
  name: string;
  color: string;
  icon: any;
  description: string;
  category:
    | "intent"
    | "defi"
    | "privacy"
    | "ai"
    | "betting"
    | "bridge"
    | "contract"
    | "validation"
    | "execution"; // Add this field
  technology: "BOB Gateway" | "DeFi" | "Transaction" | "Glittr"; // Add this field
  inputs?: {
    type: "number" | "text" | "address" | "select";
    label: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
    unit?: string;
  }[];
  compatibleWith: string[];
}

interface BlockValues {
  [key: string]: {
    [key: string]: string;
  };
}

interface GasEstimates {
  totalGas: number;
  totalTime: number;
}

interface TransactionFlowVisualizerProps {
  blocks: BlockType[];
  values: BlockValues;
}
