import { Account, GlittrSDK, txBuilder } from "@glittr-sdk/sdk";
import { useState, useMemo } from "react";

type NetworkType = "regtest" | "testnet" | "mainnet";

interface ExecutionResult {
  success: boolean;
  error?: string;
  details?: {
    txid?: string;
  };
}

const validateNetwork = (network: string): NetworkType => {
  if (network === "regtest" || network === "testnet" || network === "mainnet") {
    return network;
  }
  return "regtest";
};

class GlittrService {
  private async createAndValidateContract(
    values: Record<string, string>
  ): Promise<string> {
    try {
      const network = validateNetwork(values.Network || "regtest");
      console.log("Initializing with network:", network);

      const sdk = new GlittrSDK({
        network,
        electrumApi: "https://hackathon-electrum.glittr.fi",
        glittrApi: "https://hackathon-core-api.glittr.fi",
      });

      let wif = values.WIF?.trim();
      if (!wif) {
        throw new Error("WIF key is required");
      }

      let account;
      try {
        account = new Account({
          wif,
          network,
        });
      } catch (error) {
        console.error("Account creation error:", error);
        throw new Error(
          `Invalid WIF key for network ${network}. Please check your private key format.`
        );
      }

      const supplyCap = Number(values.SupplyCap || "0");
      const amountPerMint = Number(values.AmountPerMint || "0");
      const divisibility = parseInt(values.Divisibility || "0");

      if (supplyCap <= 0) {
        throw new Error("Supply cap must be greater than 0");
      }
      if (amountPerMint <= 0) {
        throw new Error("Amount per mint must be greater than 0");
      }
      if (divisibility < 0 || divisibility > 18) {
        throw new Error("Divisibility must be between 0 and 18");
      }

      console.log("Creating contract with parameters:", {
        network,
        supplyCap,
        amountPerMint,
        divisibility,
      });

      const contractTx = txBuilder.freeMintContractInstantiate({
        simple_asset: {
          supply_cap: supplyCap.toString(),
          divisibility: divisibility,
          live_time: 0,
        },
        amount_per_mint: amountPerMint.toString(),
      });

      const txid = await sdk.createAndBroadcastTx({
        account: account.p2pkh(),
        tx: contractTx,
        outputs: [],
      });

      return txid;
    } catch (error) {
      console.error("Contract creation error:", error);
      throw error;
    }
  }

  async executePath(
    blocks: BlockType[],
    values: Record<string, Record<string, string>>
  ): Promise<ExecutionResult> {
    try {
      const contractValues = values["chain-0"] || {};
      console.log("Creating contract with values:", contractValues);

      if (!contractValues.WIF) {
        throw new Error("WIF key is required");
      }

      if (!contractValues.Network) {
        throw new Error("Network selection is required");
      }

      const txid = await this.createAndValidateContract(contractValues);
      console.log("Contract created with TXID:", txid);

      return {
        success: true,
        details: {
          txid,
        },
      };
    } catch (error) {
      console.error("Glittr error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }
}

interface GlittrHookResult {
  executePath: (
    blocks: BlockType[],
    values: Record<string, Record<string, string>>
  ) => Promise<{ success: boolean; txid?: string; error?: string }>;
  isExecuting: boolean;
}

export const useGlittr = (): GlittrHookResult => {
  const [isExecuting, setIsExecuting] = useState(false);
  const service = useMemo(() => new GlittrService(), []);

  const executePath = async (
    blocks: BlockType[],
    values: Record<string, Record<string, string>>
  ): Promise<{ success: boolean; txid?: string; error?: string }> => {
    setIsExecuting(true);

    try {
      const result = await service.executePath(blocks, values);

      if (!result.success || !result.details) {
        throw new Error(result.error || "Failed to create contract");
      }

      return {
        success: true,
        txid: result.details.txid,
      };
    } catch (error) {
      console.error("Execution error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    executePath,
    isExecuting,
  };
};
