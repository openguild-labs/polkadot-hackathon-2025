import { formatDistance } from "date-fns";
import { LinkData } from "@/types/link";

interface ClaimDetailsProps {
  linkData: LinkData;
}

export function ClaimDetails({ linkData }: ClaimDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">From Address</p>
        <p className="font-mono bg-secondary/20 p-3 rounded-lg text-sm">
          {linkData.senderAddress}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Amount</p>
        <p className="text-3xl font-bold text-foreground">
          {linkData.amount} WST
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Expires</p>
        <p className="text-foreground">
          {formatDistance(linkData.expiresAt, new Date(), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
