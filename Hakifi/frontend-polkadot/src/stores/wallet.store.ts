import { create } from 'zustand';
import { Wallet } from '@/@type/wallet.type';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type WalletStore = {
  wallet?: Wallet;
  accessToken?: string;
  isLogging: boolean;
  setWallet: (wallet: Wallet | undefined) => void;
  setAccessToken: (accessToken: string) => void;
  setIsLogging: (isLogging: boolean) => void;
  reset: () => void;
};

const useWalletStore = create<WalletStore>()(
  persist(
    immer(
      (set, get) => ({
        isLogging: false,
        setIsLogging: (isLogging: boolean) =>
          set(
            (state) => {
              state.isLogging = isLogging;
            }
          ),
        setWallet: (wallet: Wallet | undefined) =>
          set(
            (state) => {
              state.wallet = wallet;
            }
          ),
        setAccessToken: (accessToken: string) =>
          set(
            (state) => {
              state.accessToken = accessToken;
            }
          ),
        reset: () =>
          set(
            (state) => {
              state.accessToken = undefined;
              state.wallet = undefined;
            }
          ),
      })
    ),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export default useWalletStore;
