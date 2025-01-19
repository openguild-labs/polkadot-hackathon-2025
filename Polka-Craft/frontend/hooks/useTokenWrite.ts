import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract } from "@/lib/contract";

export function useApprove() {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const approve = (spender: string, value: bigint) => {
    const transaction = prepareContractCall({
      contract,
      method: "function approve(address spender, uint256 value) returns (bool)",
      params: [spender, value],
    });
    return sendTransaction(transaction);
  };

  return { approve, isPending };
}

export function useTransfer() {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const transfer = (to: string, value: bigint) => {
    const transaction = prepareContractCall({
      contract,
      method: "function transfer(address to, uint256 value) returns (bool)",
      params: [to, value],
    });
    return sendTransaction(transaction);
  };

  return { transfer, isPending };
}

export function useTransferFrom() {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const transferFrom = (from: string, to: string, value: bigint) => {
    const transaction = prepareContractCall({
      contract,
      method: "function transferFrom(address from, address to, uint256 value) returns (bool)",
      params: [from, to, value],
    });
    return sendTransaction(transaction);
  };

  return { transferFrom, isPending };
} 