"use client";

import { useState, useEffect } from "react";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
  useAccount,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateLinkAnimation } from "./CreateLinkAnimation";
import { abi } from "@/lib/abi";

interface CreateLinkFormProps {
  onCreateLink: (data: {
    amount: number;
    expiration: number;
    linkId: string;
  }) => void;
  onClose: () => void;
}

const CONTRACT_ADDRESS = "0xbef368894A05B7F1E0e64a78eE530222e0e63471";

export default function CreateLinkForm({
  onCreateLink,
  onClose,
}: CreateLinkFormProps) {
  const [amount, setAmount] = useState("");
  const [expiration, setExpiration] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const { address } = useAccount();

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { data: senderLinks, refetch: refetchLinks } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "getSenderLinks",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    const checkLinks = async () => {
      if (!isPending && hash) {
        await refetchLinks();
        if (
          senderLinks &&
          Array.isArray(senderLinks) &&
          senderLinks.length > 0
        ) {
          const linkId = senderLinks[senderLinks.length - 1] as `0x${string}`;

          onCreateLink({
            amount: Number(amount),
            expiration: Number(expiration) * 24 * 60 * 60,
            linkId: linkId,
          });

          setIsCreating(true);
          setGeneratedLink(`${window.location.origin}/claim?linkId=${linkId}`);
        }
      }
    };

    checkLinks();
  }, [isPending, hash]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expirationInSeconds =
      Math.floor(Date.now() / 1000) + Number(expiration) * 24 * 60 * 60;

    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: "createLink",
        args: [BigInt(expirationInSeconds)],
        value: BigInt(Number(amount) * 1e18),
      });
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  const handleAnimationComplete = () => {
    onClose();
  };

  if (isCreating) {
    return (
      <CreateLinkAnimation
        link={generatedLink}
        onAnimationComplete={handleAnimationComplete}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <label className="text-lg font-medium">Amount (WST)</label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="rounded-xl h-14 text-lg px-4"
        />
      </div>

      <div className="space-y-3">
        <label className="text-lg font-medium">Expiration Time</label>
        <Select value={expiration} onValueChange={setExpiration}>
          <SelectTrigger className="rounded-xl h-14 text-lg">
            <SelectValue placeholder="Select expiration time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1" className="text-lg py-3">
              1 day
            </SelectItem>
            <SelectItem value="7" className="text-lg py-3">
              7 days
            </SelectItem>
            <SelectItem value="30" className="text-lg py-3">
              30 days
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-xl text-lg py-6 mt-6"
        disabled={isPending || isConfirming}
      >
        {isPending || isConfirming ? "Creating..." : "Create Link"}
      </Button>

      {hash && !isPending && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground break-all">
            Transaction Hash: {hash}
          </p>
        </div>
      )}
    </form>
  );
}
