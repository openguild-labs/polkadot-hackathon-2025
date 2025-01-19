export type Wallet = {
  createdAt: string;
  defaultMyRefCode: string;
  email: string;
  hierarchy: null | string;
  id: string;
  nonce: null | string;
  phoneNumber: string;
  refCode: null | string;
  updatedAt: string;
  username: string;
  walletAddress: string;
  level?: number;
  isPartner?: boolean;
  isFaucet: boolean;
};

export type User = {
  accessToken: string;
  user: Wallet;
};
