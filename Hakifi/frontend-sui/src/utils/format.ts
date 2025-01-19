
import { format } from 'date-fns';

export const formatPriceToWeiValue = (_num: number, decimals: number) => {
  return BigInt(_num * 10 ** decimals);
};

export const formatWeiValueToPrice = (_num: number, decimals: number) => {
  return Number(_num) / 10 ** decimals;
};

const truncateFractionAndFormat = (
  parts: Intl.NumberFormatPart[],
  digits: number
) => {
  const value = parts
    .map(({ type, value }) => {
      if (type !== 'fraction' || !value || value.length < digits) {
        return value;
      }

      let retVal = '';
      for (
        let idx = 0, counter = 0;
        idx < value.length && counter < digits;
        idx++
      ) {
        if (value[idx] !== '0') {
          counter++;
        }
        retVal += value[idx];
      }
      return retVal;
    })
    .reduce((string, part) => string + part);
  return value;
};

export const formatNumber = (n?: number | string | bigint, digits = 2) => {
  if (!n) return '0';

  if (typeof n === 'string') n = Number(n);

  const formatter = Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
  return truncateFractionAndFormat(formatter.formatToParts(n), digits);
};

export const numberFormater = (num: number, digits: number) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  if (num >= 0 && num < 1e6) {
    return formatNumber(num, digits);
  } else
    return item
      ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
      : '0';
};

// export const formatGweiNumberStr = (num: any, digits = 2, decimals = 18) => {
//   return formatNumber(formatUnits(BigInt(num), decimals), digits);
// };

export const formatTime = (value: Date | number, f = 'yyyy-MM-dd HH:mm') => {
  try {
    if (value) {
      const date = value instanceof Date ? value : new Date(value);
      return format(date, f);
    }
    return null;
  } catch (error) {
    console.log('formatTime', error);
    return null;
  }
};
