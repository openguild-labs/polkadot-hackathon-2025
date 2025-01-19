import { prepareEvent } from "thirdweb";
import { useContractEvents } from "thirdweb/react";
import { contract } from "@/lib/contract";

const approvalEvent = prepareEvent({
  signature: "event Approval(address indexed owner, address indexed spender, uint256 value)",
});

const transferEvent = prepareEvent({
  signature: "event Transfer(address indexed from, address indexed to, uint256 value)",
});

export function useApprovalEvents() {
  return useContractEvents({
    contract,
    events: [approvalEvent],
  });
}

export function useTransferEvents() {
  return useContractEvents({
    contract,
    events: [transferEvent],
  });
} 