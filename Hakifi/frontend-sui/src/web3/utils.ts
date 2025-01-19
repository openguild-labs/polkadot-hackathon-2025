import { DISABLED_AUTO_CONNECT_KEY } from './constants';

export const disableAutoConnect = () => {
  localStorage.setItem(DISABLED_AUTO_CONNECT_KEY, 'true');
};

export const enableAutoConnect = () => {
  localStorage.removeItem(DISABLED_AUTO_CONNECT_KEY);
};

export const isDisabledAutoConnect = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DISABLED_AUTO_CONNECT_KEY) === 'true';
};
