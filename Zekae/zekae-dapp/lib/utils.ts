import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MOONBASE_ALPHA_ADDRESSES, KAIROS_ADDRESSES } from "@/lib/addresses";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateHash(hash: string, startLength: number = 6, endLength: number = 4) {
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
}

export function formatBalance(balance: string) {
  // Convert string to number and format with thousand separators
  return Number(balance).toLocaleString();
}

export function getAddressesBasedOnChainId(chainId: number | undefined) {
  switch (chainId) {
    case 1287:
      return MOONBASE_ALPHA_ADDRESSES;
    case 1001:
      return KAIROS_ADDRESSES;
    default:
      return MOONBASE_ALPHA_ADDRESSES;
  }
}
