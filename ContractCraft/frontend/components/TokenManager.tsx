import { useState } from "react";
import { useTokenName, useTokenSymbol, useBalanceOf, useTotalSupply } from "@/hooks/useTokenRead";
import { useTransfer } from "@/hooks/useTokenWrite";
import { useTransferEvents } from "@/hooks/useTokenEvents";

export function TokenManager({ userAddress }: { userAddress: string }) {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  // Read hooks
  const { data: name } = useTokenName();
  const { data: symbol } = useTokenSymbol();
  const { data: balance } = useBalanceOf(userAddress);
  const { data: totalSupply } = useTotalSupply();

  // Write hooks
  const { transfer, isPending: isTransferPending } = useTransfer();

  // Event hooks
  const { data: transferEvents } = useTransferEvents();

  const handleTransfer = async () => {
    if (!amount || !recipientAddress) return;
    
    try {
      await transfer(
        recipientAddress,
        BigInt(amount)
      );
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        {/* Token Info */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Token Information</h2>
          <p>Name: {name || "Loading..."}</p>
          <p>Symbol: {symbol || "Loading..."}</p>
          <p>Your Balance: {balance ? balance.toString() : "Loading..."}</p>
          <p>Total Supply: {totalSupply ? totalSupply.toString() : "Loading..."}</p>
        </div>

        {/* Transfer Form */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-xl font-bold mb-4">Transfer Tokens</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Recipient Address</label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Amount in tokens"
              />
            </div>
            <button
              onClick={handleTransfer}
              disabled={isTransferPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isTransferPending ? "Processing..." : "Transfer"}
            </button>
          </div>
        </div>

        {/* Recent Transfers */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Recent Transfers</h2>
          <div className="space-y-2">
            {transferEvents?.slice(0, 5).map((event, index) => (
              <div key={index} className="text-sm">
                From: {event.data.from.slice(0, 6)}...{event.data.from.slice(-4)}
                {" → "}
                To: {event.data.to.slice(0, 6)}...{event.data.to.slice(-4)}
                {" | "}
                Amount: {event.data.value.toString()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 