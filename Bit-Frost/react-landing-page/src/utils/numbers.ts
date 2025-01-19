export const toInternationalCurrencySystemSplit = (labelValue: string, percent?: number) => {
  const result: { value?: string; unit?: string } = {};
  if (Math.abs(Number(labelValue)) >= 1.0e9) {
    result.value = (Math.abs(Number(labelValue)) / 1.0e9).toFixed(percent || 2);
    result.unit = 'B';
  } else if (Math.abs(Number(labelValue)) >= 1.0e6) {
    result.value = (Math.abs(Number(labelValue)) / 1.0e6).toFixed(percent || 2);
    result.unit = 'M';
  } else if (Math.abs(Number(labelValue)) >= 1.0e3) {
    result.value = (Math.abs(Number(labelValue)) / 1.0e3).toFixed(percent || 2);
    result.unit = 'K';
  } else {
    result.value = Math.abs(Number(labelValue)).toFixed(percent || 2);
    result.unit = '';
  }
  return result;
};

export const toInternationalCurrencySystem = (labelValue: string, percent?: number) => {
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(percent || 2) + 'B'
    : Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(percent || 2) + 'M'
    : Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(percent || 2) + 'K'
    : Math.abs(Number(labelValue)).toFixed(percent || 2);
};

export const toPrecision = (
  number: string,
  precision: number,
  withCommas: boolean = false,
  atLeastOne: boolean = true
): string => {
  const [whole, decimal = ''] = number.split('.');

  let str = `${withCommas ? formatWithCommas(whole) : whole}.${decimal.slice(0, precision)}`.replace(/\.$/, '');
  if (atLeastOne && Number(str) === 0 && str.length > 1) {
    var n = str.lastIndexOf('0');
    str = str.slice(0, n) + str.slice(n).replace('0', '1');
  }

  return str;
};

export function formatWithCommas(value: string): string {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.replace(pattern, '$1,$2');
  }
  return value;
}
