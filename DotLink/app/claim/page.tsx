"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
import { formatDistance } from "date-fns";
import { ClaimAnimation } from "@/components/claim/ClaimAnimation";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { abi } from "@/lib/abi";
import { useSearchParams } from "next/navigation";

const CONTRACT_ADDRESS = "0xbef368894A05B7F1E0e64a78eE530222e0e63471";

export default function ClaimPage() {
  const { address, connect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const searchParams = useSearchParams();
  const linkId = searchParams.get("linkId");

  const { data: linkData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "links",
    args: linkId ? [linkId as `0x${string}`] : undefined,
    query: {
      enabled: !!linkId,
    },
  });

  const {
    data: hash,
    isPending,
    writeContract,
    isSuccess,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleClaim = async () => {
    if (!linkId) return;

    try {
      setIsLoading(true);
      setShowAnimation(true);
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: "claimLink",
        args: [linkId as `0x${string}`],
      });
    } catch (error) {
      console.error("Error claiming tokens:", error);
      setIsLoading(false);
      setShowAnimation(false);
    }
  };

  const handleAnimationComplete = () => {
    // setShowAnimation(false);
    setIsLoading(false);
  };

  if (!linkId) {
    return (
      <Card className="border border-border bg-card">
        <CardHeader className="p-8">
          <CardTitle className="text-4xl font-bold text-center">
            Invalid Link
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <p className="text-center text-muted-foreground">
            Please make sure you have the correct claim link.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!linkData) {
    return (
      <Card className="border border-border bg-card">
        <CardHeader className="p-8">
          <CardTitle className="text-4xl font-bold text-center">
            Link Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <p className="text-center text-muted-foreground">
            This link may have expired or been claimed already.
          </p>
        </CardContent>
      </Card>
    );
  }

  const [sender, amount, expirationTime, claimed] = linkData as [
    `0x${string}`,
    bigint,
    bigint,
    boolean
  ];

  console.log(linkData);

  if (claimed) {
    return (
      <Card className="border border-border bg-card">
        <CardHeader className="p-8">
          <CardTitle className="text-4xl font-bold text-center">
            Link Already Claimed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <p className="text-center text-muted-foreground">
            This link has already been claimed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <main className="container mx-auto px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border border-border bg-card">
          <CardHeader className="p-8">
            <CardTitle className="text-4xl font-bold text-center">
              Claim Your WST
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {showAnimation ? (
              <ClaimAnimation
                isProcessing={isLoading || isConfirming}
                isComplete={isConfirmed}
                onAnimationComplete={handleAnimationComplete}
              />
            ) : (
              <>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-lg text-muted-foreground">
                      From Address
                    </p>
                    <div className="font-mono bg-secondary/20 p-4 rounded-lg overflow-hidden">
                      <p className="text-base break-all">{sender}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-lg text-muted-foreground">Amount</p>
                    <p className="text-5xl font-bold text-foreground">
                      {Number(amount) / 1e18} WST
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-lg text-muted-foreground">Expires</p>
                    <p className="text-xl text-foreground">
                      {formatDistance(
                        new Date(Number(expirationTime) * 1000),
                        new Date(),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  </div>
                </div>

                {!address ? (
                  <Button
                    className="w-full rounded-full blob-button bg-primary text-primary-foreground text-xl py-8"
                    onClick={connect}
                  >
                    <WalletIcon className="mr-3 h-6 w-6" />
                    Connect Wallet to Claim
                  </Button>
                ) : (
                  <Button
                    className="w-full rounded-full blob-button text-xl py-8"
                    onClick={handleClaim}
                    disabled={isLoading || isConfirming}
                  >
                    {isLoading || isConfirming ? "Claiming..." : "Claim Tokens"}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
