import { GatewaySDK, GatewayQuoteParams, GatewayQuote } from "@gobob/bob-sdk";
import { useAccount, useSendGatewayTransaction } from "@gobob/sats-wagmi";
import { useState, useMemo } from "react";

// Initialize SDK
const sdk = new GatewaySDK("bob-sepolia");

interface ExecutionResult {
  success: boolean;
  error?: string;
  details?: {
    uuid?: string;
    psbtBase64?: string;
    quote?: GatewayQuote;
    targetToken?: string;
    balance?: number;
    requiredAmount?: number;
    insufficientFunds?: boolean;
  };
}

export class BobGatewayService {
  private async checkBalance(btcAddress: string): Promise<number> {
    try {
      const response = await fetch(
        `https://mempool.space/testnet/api/address/${btcAddress}`
      );
      const data = await response.json();
      const balance =
        data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
      return balance / 100000000;
    } catch (error) {
      console.error("Failed to check balance:", error);
      return 0;
    }
  }

  private async createQuoteParams(
    values: Record<string, string>,
    fromBtcAddress: string,
    currentBalance: number
  ): Promise<{
    params: GatewayQuoteParams;
    insufficientFunds: boolean;
    requiredAmount: number;
  }> {
    const btcAmount = parseFloat(values.Amount || "0");
    const satsAmount = Math.floor(btcAmount * 100000000);
    const bobAddress = values["BOB Address"];

    if (!bobAddress) {
      throw new Error("BOB Address is required");
    }

    const quoteParams: GatewayQuoteParams = {
      fromToken: "BTC",
      fromChain: "Bitcoin",
      fromUserAddress: fromBtcAddress,
      toChain: "bob-sepolia",
      toUserAddress: bobAddress,
      toToken: "tBTC",
      amount: satsAmount,
      gasRefill: currentBalance < btcAmount ? 1000 : 10000,
      feeRate: 2,
    };

    return {
      params: quoteParams,
      insufficientFunds: currentBalance < btcAmount,
      requiredAmount: btcAmount,
    };
  }

  async executePath(
    blocks: BlockType[],
    values: Record<string, Record<string, string>>,
    fromBtcAddress: string
  ): Promise<ExecutionResult> {
    try {
      const firstBlockValues = values[`chain-0`] || {};

      // Validate inputs first
      if (!fromBtcAddress) {
        return {
          success: false,
          error: "Bitcoin address is required",
        };
      }

      if (!firstBlockValues["BOB Address"]) {
        return {
          success: false,
          error: "BOB address is required",
        };
      }

      // Validate address formats
      if (
        !fromBtcAddress.startsWith("tb1") &&
        !fromBtcAddress.startsWith("bc1")
      ) {
        return {
          success: false,
          error:
            "Invalid Bitcoin sender address format - must start with tb1 or bc1",
        };
      }

      if (!firstBlockValues["BOB Address"].startsWith("0x")) {
        return {
          success: false,
          error: "Invalid BOB address format - must start with 0x",
        };
      }

      const currentBalance = await this.checkBalance(fromBtcAddress);
      console.log("Current balance:", currentBalance, "BTC");

      const {
        params: quoteParams,
        insufficientFunds,
        requiredAmount,
      } = await this.createQuoteParams(
        firstBlockValues,
        fromBtcAddress,
        currentBalance
      );

      if (insufficientFunds) {
        return {
          success: false,
          error: "Insufficient funds",
          details: {
            balance: currentBalance,
            requiredAmount,
            insufficientFunds: true,
          },
        };
      }

      // Get tokens and validate
      const tokens = await sdk.getTokens();
      const tbtcToken = tokens.find((t) => t.symbol === "tBTC");
      if (!tbtcToken) {
        return {
          success: false,
          error: "tBTC token not found on BOB Sepolia",
        };
      }

      // Get quote
      const quote = await sdk.getQuote(quoteParams);
      console.log("Quote received:", quote);

      // Start order
      console.log("Starting order with quote:", quote);
      console.log("Quote params:", quoteParams);
      const orderDetails = await sdk.startOrder(quote, quoteParams);

      if (!orderDetails.uuid || !orderDetails.psbtBase64) {
        return {
          success: false,
          error: "Failed to get complete order details from gateway",
        };
      }

      return {
        success: true,
        details: {
          uuid: orderDetails.uuid,
          psbtBase64: orderDetails.psbtBase64,
          quote,
          targetToken: "tBTC",
          balance: currentBalance,
          requiredAmount,
        },
      };
    } catch (error) {
      console.error("BOB Gateway error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }

  async finalizeOrder(uuid: string, bitcoinTxHex: string): Promise<boolean> {
    try {
      await sdk.finalizeOrder(uuid, bitcoinTxHex);
      return true;
    } catch (error) {
      console.error("Failed to finalize order:", error);
      return false;
    }
  }
}

export function useBobGateway() {
  const [isExecuting, setIsExecuting] = useState(false);
  const service = useMemo(() => new BobGatewayService(), []);
  const { sendGatewayTransaction } = useSendGatewayTransaction({
    toChain: "bob-sepolia",
  });
  const { address: btcAddress, connector } = useAccount();

  const executePath = async (
    blocks: BlockType[],
    values: Record<string, Record<string, string>>
  ): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
    balance?: number;
    requiredAmount?: number;
    insufficientFunds?: boolean;
  }> => {
    setIsExecuting(true);

    try {
      if (!btcAddress || !connector) {
        return {
          success: false,
          error: "Please connect your Bitcoin wallet first",
        };
      }

      const result = await service.executePath(blocks, values, btcAddress);

      if (result.details?.insufficientFunds) {
        return {
          success: false,
          error: `Insufficient funds. Required: ${result.details.requiredAmount} BTC, Available: ${result.details.balance} BTC`,
          balance: result.details.balance,
          requiredAmount: result.details.requiredAmount,
          insufficientFunds: true,
        };
      }

      if (
        !result.success ||
        !result.details?.uuid ||
        !result.details?.psbtBase64
      ) {
        return {
          success: false,
          error: result.error || "Failed to prepare transaction",
        };
      }

      // Sign the PSBT
      console.log("Signing PSBT...");
      const bitcoinTxHex = await connector.signAllInputs(
        result.details.psbtBase64
      );

      // Finalize the order
      console.log("Finalizing order...");
      const finalized = await service.finalizeOrder(
        result.details.uuid,
        bitcoinTxHex
      );
      if (!finalized) {
        return {
          success: false,
          error: "Failed to finalize order",
        };
      }

      // Send gateway transaction
      const txResponse = await sendGatewayTransaction({
        toToken: "tBTC",
        evmAddress: values[`chain-0`]?.["BOB Address"] || "",
        value: BigInt(result.details.quote?.satoshis || 0),
      });

      if (typeof txResponse === "string") {
        return {
          success: true,
          txHash: txResponse,
        };
      } else {
        return {
          success: false,
          error: "Invalid transaction response format",
        };
      }
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
}
