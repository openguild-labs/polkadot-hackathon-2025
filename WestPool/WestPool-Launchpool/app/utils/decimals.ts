export function countDecimals(num: number) {
    let numberStr = num.toString();

    if (numberStr.includes('.')) {
        let [_, decimalPart] = numberStr.split('.');
        decimalPart = decimalPart.replace(/0+$/, '');

        return decimalPart.length;
    }

    return 0;
}

// export function convertNumToOnChainFormat(
//     num: number,
//     onchainDecimals: number,
//     toString: boolean = true,
// ): bigint | string {
//     const scale = countDecimals(num);

//     if (scale > onchainDecimals) {
//         console.warn(`scale of ${scale} is > than on-chain decimals of ${onchainDecimals}, you would lose the precision of number during conversion`);
//     }

//     // scale number to integer value
//     num = num * (10 ** scale);

//     onchainDecimals = Math.max(0, onchainDecimals - scale);

//     const result = BigInt(num) * BigInt(10 ** onchainDecimals);
//     return toString ? result.toString() : result;
// }
export function convertNumToOnChainFormat(
    num: number,
    onchainDecimals: number,
    toString: boolean = true,
): bigint | string {
    const [integerPart, decimalPart = ""] = num.toString().split(".");
    const scale = decimalPart.length;

    if (scale > onchainDecimals) {
        console.warn(`Scale of ${scale} is greater than on-chain decimals of ${onchainDecimals}. Precision will be lost during conversion.`);
    }

    // Convert num to a scaled integer by removing the decimal point
    const scaledNum = BigInt(integerPart + decimalPart.padEnd(scale, "0"));

    // Calculate the remaining decimals needed to match on-chain decimals
    const totalDecimals = Math.max(0, onchainDecimals - scale);

    // Scale to the final on-chain representation
    const result = scaledNum * BigInt(10 ** totalDecimals);
    return toString ? result.toString() : result;
}


export function convertNumToOffchainFormat(
    num: bigint,
    onchainDecimals: number,
    toString: boolean = true,
): string {
    if (!num || !onchainDecimals) {
        console.error("num or onChainDecimals is undefined");
        return "";
    }

    const divisor = BigInt(10 ** onchainDecimals);
    const result = num / divisor;
    const remainder = num % divisor;

    // Handling fractional part by appending it to the result if remainder exists
    if (remainder === BigInt(0)) {
        return result.toString();
    } else {
        const fractionPart = remainder.toString().padStart(onchainDecimals, '0');
        return `${result}.${fractionPart}`;
    }
}

// Test cases
// console.log(countDecimals(123.4567));    // Output: 4
// console.log(countDecimals(123));         // Output: 0
// console.log(countDecimals(123.0));       // Output: 0
// console.log(countDecimals(123.45000));   // Output: 2
// console.log(countDecimals(123.4500007)); // Output: 7

// console.log(convertNumToOnChainFormat(0.005, 4));
// console.log(convertNumToOnChainFormat(10, 18));
// console.log(convertNumToOnChainFormat(0.0069, 18));
// console.log(convertNumToOnChainFormat(0.5 / 100, 4));
// console.log(convertNumToOnChainFormat(1.16, 18));

// Test cases for convertNumToOffchainFormat
// console.log(convertNumToOffchainFormat(BigInt(100000), 2)); // Expected output: "1000"
// console.log(convertNumToOffchainFormat(BigInt(1234567890123456789), 18)); // Expected output: "1234567890"
// console.log(convertNumToOffchainFormat(BigInt(5000000000000000), 4)); // Expected output: "500000"
// console.log(convertNumToOffchainFormat(BigInt(123456789), 0)); // Expected output: "123456789"
// console.log(convertNumToOffchainFormat(BigInt(0), 5)); // Expected output: "0"
// console.log(convertNumToOffchainFormat(BigInt(123456), 3)); // Expected output: "123"
// console.log(convertNumToOffchainFormat(BigInt(999999999), 9)); // Expected output: "1"


console.log(convertNumToOffchainFormat(BigInt(103000000000000000000), 18));
console.log(convertNumToOnChainFormat(103, 18));