export interface Link {
  id: string;
  amount: number;
  expiresAt: Date;
  status: "active" | "claimed";
}

export interface LinkData {
  senderAddress: string;
  amount: number;
  expiresAt: Date;
}
