import { useReadContract } from "thirdweb/react";
import { contract } from "@/lib/contract";

export function useAllowance(owner: string, spender: string) {
  return useReadContract({
    contract,
    method: "function allowance(address owner, address spender) view returns (uint256)",
    params: [owner, spender],
  });
}

export function useBalanceOf(who: string) {
  return useReadContract({
    contract,
    method: "function balanceOf(address who) view returns (uint256)",
    params: [who],
  });
}

export function useTotalSupply() {
  return useReadContract({
    contract,
    method: "function totalSupply() view returns (uint256)",
    params: [],
  });
}

export function useDecimals() {
  return useReadContract({
    contract,
    method: "function decimals() view returns (uint8)",
    params: [],
  });
}

export function useTokenName() {
  return useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });
}

export function useTokenSymbol() {
  return useReadContract({
    contract,
    method: "function symbol() view returns (string)",
    params: [],
  });
} 