import { ENUM_INSURANCE_SIDE } from 'hakifi-formula';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';

// export type Plan = {
//   _id: number;
//   title: string;
//   cover: string;
//   default: number;
//   min: number;
//   max: number;
// };

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
  // q_covered: number;
  margin: number;
  period: number;
  expiredAt?: Date;
  periodUnit: string;
  refCode?: string;
  plan: number;
};

type Store = Params & {
  updateParams: (params: Partial<Params>) => void;
  reset: () => void;
  openFormBuyCover: boolean;
  toggleFormBuyCover: (show: boolean) => void;
  step: number;
  setStep: (n: number) => void;
  errorFields: Array<string>;
  setErrorFields: (error: string) => void;
  removeErrorField: (error: string) => void;
  resetErrorFields: () => void;
};

const useBuyCoverStore = create<Store>()(
  persist(

    immer((set, get) => ({
      errorFields: [],
      setErrorFields(error) {
        set((state) => {
          state.errorFields = state.errorFields.concat(error);
        });
      },
      removeErrorField: (error) => {
        const newArray = get().errorFields.filter((item) => item !== error);
        set((state) => {
          state.errorFields = newArray;
        });
      },
      resetErrorFields: () => {
        set((state) => {
          state.errorFields = [];
        });
      },
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
      // q_covered: 100,
      margin: 100,
      period: 4,
      periodUnit: 'HOUR',
      side: ENUM_INSURANCE_SIDE.BULL,
      plan: 1,
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
    {
      name: "buy-cover-storage",
      partialize: (state) => ({
        plan: state.plan,
        period: state.period,
        periodUnit: state.periodUnit,
      }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useBuyCoverStore;
