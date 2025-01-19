export const STATE_INSURANCE = {
	CLAIM_WAITING: "Claim_waiting",
	REFUNDED: "Refunded",
	CLAIMED: "Claimed",
	EXPIRED: "Expired",
	LIQUIDATED: "Liquidated",
	AVAILABLE: "Available",
	CANCELLED: "Cancelled",
	INVALID: "Invalid",
	REFUND_WAITING: "Refund-waiting",
	PENDING: "Pending",
};
export type TStateLogs = {
	state: string;
	txhash: string;
	error: any;
	time: string;
};

export type TDataTransaction = {
	id: string;
	state: keyof typeof STATE_INSURANCE;
	side: string;
	asset: string;
	unit: string;
	txhash: string;
	stateLogs: TStateLogs[];
	q_claim: number;
	margin: number;
	updatedAt: string;
	createdAt: string;
	closedAt: string;
};
