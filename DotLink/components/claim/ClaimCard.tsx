"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClaimDetails } from "./ClaimDetails";
import { ClaimButton } from "./ClaimButton";
import { LinkData } from "@/types/link";

interface ClaimCardProps {
  linkData: LinkData;
}

export function ClaimCard({ linkData }: ClaimCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Claim Your WST
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ClaimDetails linkData={linkData} />
        <ClaimButton isLoading={isLoading} setIsLoading={setIsLoading} />
      </CardContent>
    </Card>
  );
}
