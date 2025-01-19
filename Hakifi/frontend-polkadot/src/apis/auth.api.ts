import { Wallet } from '@/@type/wallet.type';
import request from "./request/instance";

type AuthBody = {
  walletAddress: string;
  signature: string;
};

type AuthResult = {
  accessToken: string;
  user: Wallet;
};

export const login = async (body: AuthBody) => {
  const res = await request.post<AuthResult>('/auth/login', body);
  return res;
};

export const getNonce = async (walletAddress: string) => {
  const res = await request.get<{ nonce: string; }>('/auth/nonce', {
    params: { walletAddress },
  });
  return res.nonce;
};
