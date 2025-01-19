export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const round = (num: number, precision: number) => {
  const modifier = 10 ** precision;
  return Math.round(num * modifier) / modifier;
};

export const inRange = (
  num: number,
  rangeStart: number,
  rangeEnd: number = 0,
) =>
  (rangeStart < num && num < rangeEnd) || (rangeEnd < num && num < rangeStart);

export const diff = (num1: number, num2: number) => {
  return Math.abs(num1 - num2);
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
  { leading }: { leading?: boolean } = {},
) => {
  let timerId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    if (!timerId && leading) {
      func(...args);
    }
    clearTimeout(timerId);

    timerId = setTimeout(() => func(...args), delay);
  };
};

export const uniq = <T>(arr: T[]) => Array.from(new Set(arr));

export const floor = (num: number, precision: number) => {
  const modifier = 10 ** precision;
  return Math.floor(num * modifier) / modifier;
};
