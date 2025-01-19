import { STATE_INSURANCES } from "@/utils/constant";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";

export interface IPairConfig {
	id: string;
	symbol: string;
	asset: string;
	unit: string;
	isMaintain: boolean;
	isActive: boolean;
	isHot: boolean;
	createdAt: string;
	updatedAt: string;
	token: TokenInfo;
	config: IConfig;
}
interface IConfig {
	listDayChangeRatio: number[];
	listHourChangeRatio: [];
}
interface TokenInfo {
	id: string;
	symbol: string;
	attachment: string;
	decimals: number;
}

export interface IInformationChart {
	[key: string]: number | Date | undefined;
}

export interface Insurance {
	stateLogs: StateLog[];
	metadata: any;
	id: string;
	userId: string;
	txhash: string;
	asset: string;
	unit: string;
	margin: number;
	q_claim: number;
	q_covered: number;
	p_open: number;
	p_close: number;
	p_liquidation: number;
	p_claim: number;
	p_refund: number;
	p_cancel: number;
	leverage: number;
	periodChangeRatio: number;
	hedge: number;
	systemCapital: number;
	token: {
		attachment: string;
		name: string;
	};
	invalidReason: any;
	period: number;
	periodUnit: string;
	state: keyof typeof STATE_INSURANCES;
	side: ENUM_INSURANCE_SIDE;
	isTransferBinance: boolean;
	expiredAt: string;
	closedAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface StateLog {
	state: string;
	txhash: string;
	error: any;
	time: string;
}

export interface Token {
	id: string;
	symbol: string;
	asset: string;
	unit: string;
	isMaintain: boolean;
	isActive: boolean;
	isHot: boolean;
	createdAt: string;
	updatedAt: string;
	token: Token;
}

export interface Token {
	id: string;
	attachment: string;
	decimals: number;
}

export type LocalStorageInsurances = {
	id: string;
	flag: boolean;
}[];

