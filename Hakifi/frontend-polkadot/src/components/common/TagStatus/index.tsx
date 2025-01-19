import { STATE_INSURANCES } from "@/utils/constant";
import clsx from "clsx";
import Tag from "../Tag";

interface IProps {
  title: string;
  variant:  "primary" | "error" | "warning" | "disabled" | "success";
}

export const statusDefined: Record<keyof typeof STATE_INSURANCES, IProps> = {
  CLAIM_WAITING: {
    title: "Claim-waiting",
    variant: "warning",
  },
  REFUNDED: {
    title: "Refunded",
    variant: "success",
  },
  CLAIMED: {
    title: "Claimed",
    variant: "success",
  },
  LIQUIDATED: {
    title: "Liquidated",
    variant: "error",
  },
  AVAILABLE: {
    title: "Available",
    variant: "primary",
  },
  CANCELLED: {
    title: "Cancelled",
    variant: "disabled",
  },
  INVALID: {
    title: "Invalid",
    variant: "disabled",
  },
  REFUND_WAITING: {
    title: "Refund-waiting",
    variant: "warning",
  },
  EXPIRED: {
    title: "Expired",
    variant: "error",
  },
  PENDING: {
    title: "Pending",
    variant: "warning",
  },
};

const TagStatus = ({ status }: { status: keyof typeof STATE_INSURANCES }) => {
  const statusInfo = statusDefined?.[status];
  return (
    <Tag variant={statusInfo.variant} text={statusInfo.title}/>
  );
};

export default TagStatus;
