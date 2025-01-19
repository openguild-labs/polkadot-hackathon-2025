import dayjs from "dayjs";

export const ERROR_CODE = {
	INVALID_REFERRAL_CODE: "invalid_referral_code",
	EXCEEDS_THE_LIMIT: "exceeds_the_limit",
	EXCEEDS_THE_LIMIT_PER_USER: "exceeds_the_limit_per_user",
	CODE_ALREADY_EXISTS: "already_exists",
};

export const levels = [
	{ level: 1, rate: 1, min: 1, max: 20000 },
	{ level: 2, rate: 2, min: 20001, max: 50000 },
	{ level: 3, rate: 3, min: 50001, max: 100000 },
	{ level: 4, rate: 4, min: 100001, max: 200000 },
	{ level: 5, rate: 5, min: 200001, max: 400000 },
	{ level: 6, rate: 6, min: 400001, max: 600000 },
	{ level: 7, rate: 7, min: 600001, max: 800000 },
	{ level: 8, rate: 8, min: 800001, max: 1000000 },
	{ level: 9, rate: 10, min: 1000001, max: 9999999999 },
];
export const LIMIT_PAGE = 10;

export const COMMISSION_TYPE = {
	DIRECT: "Direct",
	INDIRECT: "Indirect",
	SHARE_BACK: "Shared",
};

export function floorNumber(num: number, decimal = 6) {
	if (!num) return 0;
	const numStr = `${num}`;
	const decimalIndex = numStr.indexOf(".");
	if (decimalIndex === -1 || numStr.length - decimalIndex - 1 <= decimal) {
		return num;
	} else {
		return parseFloat(numStr.slice(0, decimalIndex + decimal + 1));
	}
}

export const formatLabelChart = (value: string, categories: string[]) => {
	if (value !== undefined) {
		if (value === categories[categories.length - 1]) {
			return dayjs(value, "DD/MM/YYYY").format("DD/MM");
		} else return dayjs(value).format("DD/MM");
	}
	return dayjs(value).format("DD/MM");
};
