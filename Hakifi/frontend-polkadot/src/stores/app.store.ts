import { create } from 'zustand';
// import { produce } from 'immer';
import { immer } from 'zustand/middleware/immer';

type Store = {
  isSupportChain: boolean;
  toggleIsSupportChainModal: (isOpen?: boolean) => void;

  isOpenConnectWallet: boolean;
  toggleConnectWalletModal: (isOpen: boolean) => void;

  startOnboard: boolean;
  setStartOnboard: (startOnboard: boolean) => void;

  isOpenTerminology: boolean;
  toggleOpenTerminology: () => void;
};

const useAppStore = create<Store>()(
  immer((set, get) => ({
    isSupportChain: false,
    toggleIsSupportChainModal: (isOpen) =>
      set(
        (state) => {
          state.isSupportChain = isOpen !== undefined ? isOpen : !state.isSupportChain;
        },
      ),
    startOnboard: false,
    setStartOnboard(startOnboard) {
      set(
        (state) => {
          state.startOnboard = startOnboard;
        },
      );
    },
    isOpenConnectWallet: false,
    toggleConnectWalletModal: (isOpen) =>
      set(
        (state) => {
          state.isOpenConnectWallet = isOpen;
        },
      ),
    isOpenTerminology: false,
    toggleOpenTerminology: () => set(
      (state) => {
        state.isOpenTerminology = !state.isOpenTerminology;
      },
    ),
  }))
);

export default useAppStore;
