import { ENUM_INSURANCE_SIDE, PERIOD_UNIT } from 'hakifi-formula';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type Params = {
  side: ENUM_INSURANCE_SIDE.BULL | ENUM_INSURANCE_SIDE.BEAR;
  unit: string;
  q_claim?: number;
  p_open?: number;
  p_liquidation?: number;
  p_refund?: number;
  p_cancel?: number;
  hedge?: number;
  hedgeClaim?: number;
  p_claim?: number;
  periodChangeRatio?: number;
  q_covered: number;
  margin: number;
  period: number;
  expiredAt?: Date;
  periodUnit: string;
  refCode?: string;
};

type Store = Params & {
  updateParams: (params: Partial<Params>) => void;
  reset: () => void;
  openFormBuyCover: boolean;
  toggleFormBuyCover: (show: boolean) => void;
  step: number;
  setStep: (n: number) => void;
};

const useBuyCoverStore = create<Store>()(
  immer((set) => ({
    openFormBuyCover: false,
    step: 0,
    setStep: (number: number) => {
      set((state) => {
        state.step = number;
      });
    },
    toggleFormBuyCover: (show: boolean) => {
      set((state) => {
        state.openFormBuyCover = show;
      });
    },
    unit: 'USDT',
    q_covered: 100,
    margin: 5,
    period: 4,
    periodUnit: 'HOUR',
    side: ENUM_INSURANCE_SIDE.BULL,
    updateParams: (params: Partial<Params>) => {
      set((state) => {
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            // @ts-ignore
            state[key] = params[key as keyof Params];
          }
        }
      });
    },
    reset: () => {
      set((state) => {
        state.q_claim = undefined;
        state.p_open = undefined;
        state.p_liquidation = undefined;
        state.p_refund = undefined;
        state.p_cancel = undefined;
        state.hedge = undefined;
        state.p_claim = undefined;
        state.periodChangeRatio = undefined;
        state.expiredAt = undefined;
        state.refCode = undefined;
      });
    },
  })),
);

export default useBuyCoverStore;
