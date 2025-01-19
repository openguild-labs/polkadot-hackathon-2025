"use client";

import { CheckCircle2, Wallet, ArrowDownToLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClaimAnimationProps {
  onAnimationComplete: () => void;
  isProcessing: boolean;
  isComplete: boolean;
}

export function ClaimAnimation({
  onAnimationComplete,
  isProcessing,
  isComplete,
}: ClaimAnimationProps) {
  let stage: "claiming" | "processing" | "complete" = "claiming";

  if (isProcessing) {
    stage = "processing";
  }
  if (isComplete) {
    stage = "complete";
    // Call onAnimationComplete after a delay when complete
    setTimeout(onAnimationComplete, 1000);
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="relative">
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500",
            stage === "claiming" && "bg-primary/20",
            stage === "processing" && "bg-secondary/20",
            stage === "complete" && "bg-green-500/20"
          )}
        >
          {stage === "claiming" && (
            <Wallet className="w-8 h-8 text-primary animate-pulse" />
          )}
          {stage === "processing" && (
            <ArrowDownToLine className="w-8 h-8 text-secondary animate-bounce" />
          )}
          {stage === "complete" && (
            <CheckCircle2 className="w-8 h-8 text-green-500 animate-in zoom-in" />
          )}
        </div>
      </div>
      <p className="text-lg text-muted-foreground">
        {stage === "claiming" && "Claiming your tokens..."}
        {stage === "processing" && "Processing transaction..."}
        {stage === "complete" && "Tokens claimed successfully!"}
      </p>
    </div>
  );
}
