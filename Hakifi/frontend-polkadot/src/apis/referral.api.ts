import request from "./request/instance";

export type ParamsTransaction = {
	page?: number;
	limit?: number;
	type?: "MARGIN" | "CLAIM" | "REFUND" | "CANCEL";
	sort?: "-time";
	from?: number | Date;
	to?: number | Date;
	unit?: "USDT" | "VNST";
};

export const getTransactionsList = async (params: ParamsTransaction) => {
	const res = await request.get<any>("/transactions", { params });
	return res;
};

type ParamsCreateRef = {
	code: string;
	myPercent: number;
	description: string;
};

export const createRefCode = async (params: ParamsCreateRef) => {
	const res = await request.post<any>("/users/referral-codes", {
		...params,
	});
	return res;
};

export const getListReferralCode = async () => {
	const res = await request.get<any>("/users/referral-codes");
	return res;
};

export const updateDefaultCode = async (params: {
	defaultMyRefCode: string;
}) => {
	return await request.patch<any>("/users/me", {
		...params,
	});
};

export const getFriendStatistic = async () => {
	return await request.get<any>("/users/friends-statistic");
};

export type TParamsGetFriendList = {
	page: number;
	limit: number;
	sort?: string;
	q?: string;
	type?: string;
	invitedAtFrom?: Date;
	invitedAtTo?: Date;
};

export const getFriendList = async (params: TParamsGetFriendList) => {
	return await request.get<any>("/users/friends", { params });
};

export const addReferralCode = async (params: { code: string }) => {
	return await request.post<any>("/users/add-referral-code", { ...params });
};

type TParamsUpdateDescription = {
	childId: string;
	note: string;
};

export const updateDescriptionFriend = async (
	params: TParamsUpdateDescription
) => {
	return await request.put<any>("/users/referral-info", {
		...params,
	});
};

export const updateDescRefCode = async (params: {
	description: string;
	code: string;
}) => {
	return await request.patch<any>(`/users/referral-codes/${params.code}`, {
		...params,
	});
};

export const getFriendListInRefCode = async (code: string) => {
	return await request.get<any>(`/users/referral-codes/${code}/friends`);
};
export const getUserStats = async () => {
	return await request.get<any>("/users/me/stats");
};

export const getPnlUser = async (params: any) => {
	if (params !== undefined) {
		return await request.get<any>("/users/me/stats/daily", { params });
	} else return await request.get<any>("/users/me/stats/daily");
};

export const getFriendHistoryList = async (params: any) => {
	return await request.get("/commissions", { params });
};

export const getCommissionUser = async () => {
	return await request.get("/commission/reward-stats");
};

export const withDraw = async () => {
	return await request.post("/wallets/withdraw-commission");
};

export const getReferralCodeInfo = async (code: string) => {
	return await request.get(`/users/referral-codes/${code}`);
};

export const getFriendInfo = async (friendId: string) => {
	return await request.get(`/users/friends/${friendId}`);
};
export const getWalletStatistic = async (asset: "VNST" | "USDT") => {
	return await request.get("/wallets", {
		params: {
			asset,
		},
	});
};
