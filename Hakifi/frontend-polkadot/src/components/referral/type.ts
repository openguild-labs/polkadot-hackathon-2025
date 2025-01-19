export type Transaction = {
	amount: number;
	error: null | string;
	id: string;
	insuranceId: string;
	status: string;
	time: string;
	txhash: string;
	type: "MARGIN" | "CLAIM" | "REFUND" | "CANCEL" | 'WITHDRAW';
	unit: "USDT" | "VNST";
	userId: string;
};

export type TFriends = {
	createdAt: string;
	defaultMyRefCode: string;
	email: string | null;
	hierarchy: string;
	id: string;
	invitedAt: string;
	isPartner: boolean;
	level: number;
	nonce: string | null;
	note: string;
	phoneNumber: string | null;
	refCode: string;
	totalFriends: number;
	updatedAt: string;
	username: string | null;
	walletAddress: string;
	totalCommission: number;
	type: number
};

export type TCommission = {
	id: string;
	insuranceId: string;
	fromUserId: string;
	toUserId: string;
	amount: number;
	asset: string;
	commissionType: "DIRECT" | "INDIRECT" | "SHARE_BACK";
	type: number;
	toUserLevel: number;
	createdAt: string;
	updatedAt: string;
	fromUser: {
		id: string;
		walletAddress: string;
	};
	insurance: {
		id: string;
		asset: string;
		unit: string;
		side: string;
		margin: number;
		closedAt: string;
		token: {
			attachment: string;
			symbol: string;
		};
	};
};
type Parent = {
	id: string;
	walletAddress: string;
	username: string | null;
	email: string | null;
	phoneNumber: string | null;
	defaultMyRefCode: string;
	refCode: string;
	nonce: string | null;
	createdAt: string;
	updatedAt: string;
	invitedAt: string;
	hierarchy: string;
	totalFriends: number;
	level: number;
	isPartner: boolean;
};

export type TFriendStatistic = {
	id: string;
	username: string | null;
	email: string | null;
	walletAddress: string;
	refCode: string;
	hierarchy: string;
	invitedAt: string;
	totalCommission: number;
	metadata: {
		friendType: number;
		referralCode: {
			id: string;
			userId: string;
			code: string;
			description: string;
			createdAt: string;
			updatedAt: string;
			myPercent: number;
		};
		note: string;
		parent?: Parent;
	};
	totalMargin: number;
	totalContract: number
};

export type UserStats = {
	id: string;
	userId: string;
	totalInsurance: number;
	totalInsuranceClosed: number;
	totalInsuranceClaimed: number;
	totalInsuranceRefunded: number;
	totalInsuranceLiquidated: number;
	totalInsuranceExpired: number;
	totalPayback: number;
	totalMargin: number;
	totalPnl: number;
	totalFriendsMargin: number;
	lastCheckLevelTime: string;
	time?:string
};

export type WalletStatistic = {
	id: string;
	userId: string;
	asset: string;
	balance: number;
	locked: number;
	createdAt: string;
	updatedAt: string;
	totalCommission: number;
};