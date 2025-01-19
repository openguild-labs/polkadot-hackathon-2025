import { getUserStats } from "@/apis/referral.api";
import { TFriends, UserStats } from "@/components/referral/type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { handleRequest } from "@/utils/helper";
type Store = {
	openModalEdit: boolean;
	infoFriend: TFriends;
	setOpenModalEdit: (isOpen: boolean) => void;
	errorCreateCode: string;
	setErrorCreateCode: (error: string) => void;
	setOpenModalEditInfo: (isOpen: boolean, friendInfo: any) => void;
	openModalEditInfo: boolean;
	openModalInfo: boolean;
	setOpenModalInfo: (isOpen: boolean) => void;
	setOpenWalletFriend: (open: boolean, wallet: any) => void;
	openWalletFriend: boolean;
	getUserStats: () => void;
	userStats: UserStats;
	openModalEditDesRef: boolean;
	setOpenModalEditDesRef: (isOpen: boolean) => void;
	openAddRefCode: boolean;
	setOpenAddRefCode: (isOpen: boolean) => void;
};

const useReferralStore = create<Store>()(
	immer((set) => ({
		openModalEdit: false,
		infoFriend: {} as TFriends,
		openModalEditInfo: false,
		openModalInfo: false,
		userStats: {} as UserStats,
		openWalletFriend: false,
		openModalEditDesRef: false,
		openAddRefCode: false,
		setOpenAddRefCode: (isOpen: boolean) => {
			set((state) => {
				state.openAddRefCode = isOpen;
			});
		},
		setOpenModalEdit: (isOpen: boolean) => {
			set((state) => {
				state.openModalEdit = isOpen;
			});
		},
		setOpenModalEditDesRef: (isOpen: boolean) => {
			set((state) => {
				state.openModalEditDesRef = isOpen;
			});
		},
		errorCreateCode: "",
		setErrorCreateCode: (error: string) => {
			set((state) => {
				state.errorCreateCode = error;
			});
		},
		setOpenModalEditInfo: (isOpen: boolean, friend: any) => {
			set((state) => {
				state.openModalEditInfo = isOpen;
				state.infoFriend = friend;
			});
		},
		setOpenModalInfo: (isOpen: boolean) => {
			set((state) => {
				state.openModalInfo = isOpen;
			});
		},
		setOpenWalletFriend: (open: boolean, wallet: any) => {
			set((state) => {
				state.openWalletFriend = open;
				state.infoFriend = wallet;
			});
		},
		getUserStats: async () => {
			const [err, res] = await handleRequest(getUserStats());
			if (err) return;
			else {
				set((state) => {
					state.userStats = res;
				});
			}
		},
	}))
);

export default useReferralStore;
