import { User } from "@/@type/wallet.type";
import request from "./request/instance";

export const getAuthUser = async () => {
	const res = await request.get<User>("/users/me");
	return res;
};

export type TParams = {
	username: string;
	email: string;
	phoneNumber: string;
	refCode: string;
	defaultMyRefCode: string;
};

export const updateUser = async (params: Partial<TParams>) => {
	const res = await request.patch<User>("/users/me", params);
	return res;
};
