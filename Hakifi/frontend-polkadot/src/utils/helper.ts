import { formatNumber } from "./format";

export function shortenHexString(
	hexString: string,
	prefixLength: number,
	suffixLength: number
): string {
	if (hexString?.length < prefixLength + suffixLength) {
		return "";
	}

	const prefix = hexString?.slice(0, prefixLength);
	const suffix = hexString?.slice(-suffixLength);

	return `${prefix}...${suffix}`;
}

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

function fallbackCopyTextToClipboard(text: string) {
	const textArea = document.createElement("textarea");
	textArea.value = text;

	// Avoid scrolling to bottom
	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.position = "fixed";

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		const successful = document.execCommand("copy");
		const msg = successful ? "successful" : "unsuccessful";
		console.log("Fallback: Copying text command was " + msg);
	} catch (err) {
		console.error("Fallback: Oops, unable to copy", err);
	}

	document.body.removeChild(textArea);
}

export const copyToClipboard = (text: string) => {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text);
};

export function handleRequest<T>(promise: Promise<T>) {
	return promise
		.then((data: T) => [undefined, data])
		.catch((err) => [err, undefined]);
}

export const inRange = (
	num: number,
	rangeStart: number,
	rangeEnd: number = 0
) => {
	return (
		(rangeStart < num && num < rangeEnd) || (rangeEnd < num && num < rangeStart)
	);
};

export const differenceTime = (date: Date, reverse = false) => {
	if (!date) return;
	const countDownDate = new Date(date).getTime();
	const now = Date.now();
	const distance = reverse ? countDownDate - now : now - countDownDate;
	const days = Math.floor(distance / (1000 * 60 * 60 * 24)) || 0;
	const hours =
		Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) || 0;
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) || 0;
	const seconds = Math.floor((distance % (1000 * 60)) / 1000) || 0;
	return { days, hours, minutes, seconds };
};

export const compNumber = (a: number, b: number, before: boolean) =>
	before ? (a < b ? a : b) : a >= b ? a : b;

export const convertMoney = (
	nameMoney: string,
	exchange_rate: number,
	amount_money: number
) => {
	if (nameMoney === "VNST") {
		return `~${formatNumber(Number(amount_money) / exchange_rate, 0)} USDT`;
	} else if (nameMoney === "USDT") {
		return `~${formatNumber(Number(amount_money) * exchange_rate, 1)} VNST`;
	}
};
const telegramRegex = /.*\B@(?=\w{5,32}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*.*/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const isTelegram = (input: string) => {
	return telegramRegex.test(input);
};

export const isEmail = (input: string) => {
	return emailRegex.test(input);
};
export const isValidInput = (input: string) => {
	if (emailRegex.test(input) || telegramRegex.test(input)) {
		return true;
	} else {
		return false;
	}
};

export const updateArray = (array: any[], maxCount: number) => {
	if (array.length <= 0 || maxCount <= 0) {
		return [];
	}
	const currentLength = array.length;
	const repeatCount = Math.ceil(maxCount / currentLength);
	const updatedArray = Array.from({ length: repeatCount }, () => array).flat();
	return updatedArray.slice(0, maxCount);
};
export const substring = (str: string, start = 10, end = -4) =>
	String(str).length > 10
		? `${String(str).substr(0, start)}...${String(str).substr(end)}`
		: str;

export const capitalize = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};


export const scanUrl = (txh: string) => process.env.NEXT_PUBLIC_CHAIN_SCAN + '/tx/' + txh;

export const handleParseDescription = (des: string) => {
	let desChange = des;
	if (des === undefined) return (desChange = '');
	else if (des.length > 160) {
		return (desChange = `${des.trim().slice(0, 160).trim()}...`);
	} else return desChange;
};

export function uint8arrayToHex(value: Uint8Array | undefined) {
	if (!value) return "";
	// @ts-ignore
	return value.toString("hex");
}