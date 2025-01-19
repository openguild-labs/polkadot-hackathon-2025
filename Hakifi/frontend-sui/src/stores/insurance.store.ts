import { Insurance, LocalStorageInsurances } from '@/@type/insurance.type';
import { IGetPairsParams, getInsuranceApi } from '@/apis/insurance.api';
import { ORDER_STATUS } from '@/utils/constant';
import { handleRequest } from '@/utils/helper';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type Store = {
  isOpenDetailModal: boolean;
  toggleDetailModal: () => void;
  isOpenCloseModal: boolean;
  toggleCloseModal: () => void;
  insuranceSelected: Insurance | null;
  setInsuranceSelected: (insurance: Insurance | null) => void;
  currentPage: number;
  setPagination: (page: number) => void;
  insurancesOpening: Insurance[];
  insurancesHistory: Insurance[];
  totalOpening: number;
  totalHistory: number;
  reset: () => void;
  getInsuranceOpening: ({ page, ...rest }: IGetPairsParams) => void;
  getInsuranceHistory: ({ page, ...rest }: IGetPairsParams) => void;
  getAllInsurance: ({ page, ...rest }: IGetPairsParams) => void;
  totalInsurances: number;
  allInsurances: Insurance[];
  hideOtherSymbol: boolean;
  setHideOtherSymbol: () => void;
  localToggleCharts: LocalStorageInsurances,
  setLocalToggleCharts: (charts: LocalStorageInsurances) => void;
};

const useInsuranceStore = create<Store>()(
  immer((set) => ({
    localToggleCharts: [],
    setLocalToggleCharts(charts) {
      set((state) => {
        state.localToggleCharts = charts;
      });
    },
    isOpenCloseModal: false,
    toggleCloseModal() {
      set((state) => {
        state.isOpenCloseModal = !state.isOpenCloseModal;
      });
    },
    insuranceSelected: null,
    setInsuranceSelected(insurance) {
      set((state) => {
        state.insuranceSelected = insurance;
      });
    },
    isOpenDetailModal: false,
    toggleDetailModal() {
      set((state) => {
        state.isOpenDetailModal = !state.isOpenDetailModal;
      });
    },
    currentPage: 1,
    setPagination(page) {
      set((state) => {
        state.currentPage = page;
      });
    },
    insurancesOpening: [],
    insurancesHistory: [],
    totalOpening: 0,
    totalHistory: 0,
    totalInsurances: 0,
    allInsurances: [],
    getInsuranceOpening: async ({ page, ...rest }: IGetPairsParams) => {
      const [err, response] = await handleRequest<{
        rows: Insurance[];
        total: number;
      }>(getInsuranceApi({ page, state: ORDER_STATUS.AVAILABLE, ...rest }));
      if (err) {
        console.log(err);
        return;
      }
      if (response) {
        const { rows, total } = response;

        set((state) => {
          state.insurancesOpening = rows;
          state.totalOpening = total;
        });
      }
    },

    getInsuranceHistory: async ({ page, ...rest }: IGetPairsParams) => {
      const [err, response] = await handleRequest<{
        rows: Insurance[];
        total: number;
      }>(getInsuranceApi({ page, isClosed: true, ...rest }));
      if (err) {
        console.log(err);
        return;
      }
      if (response) {
        const { rows, total } = response;

        set((state) => {
          state.insurancesHistory = rows;
          state.totalHistory = total;
        });
      }
    },
    getAllInsurance: async ({ page, ...rest }: IGetPairsParams) => {
      const [err, response] = await handleRequest<{
        rows: Insurance[];
        total: number;
      }>(getInsuranceApi({ page, ...rest }));
      if (err) {
        return;
      }
      if (response) {
        const { rows, total } = response;

        set((state) => {
          state.allInsurances = rows;
          state.totalInsurances = total;
        });
      }
    },
    setHideOtherSymbol: () => {
      set((state) => {
        state.hideOtherSymbol = !state.hideOtherSymbol;
      });
    },
    hideOtherSymbol: false,
    reset: () => {
      set((state) => {
        state.currentPage = 1;
        state.totalOpening = 0;
        state.totalHistory = 0;
        state.insurancesOpening = [];
        state.insurancesHistory = [];
      });
    },
  })),
);

export default useInsuranceStore;
