"use client";

import { Wallet } from "@/@type/wallet.type";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import useReferralStore from "@/stores/referral.store";
import { WalletStore } from "@/stores/wallet.store";
import { useWallet } from "@suiet/wallet-kit";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import Spinner from "../common/Spinner";
import { ModalInfo } from "./modal/ModalEditInfo";
import StatisticBox from "./StatisticBox";

const OverviewTabs = dynamic(() => import("./Profile"), {
	ssr: false,
	loading: () => (
		<div className="flex w-full items-center justify-center h-fit-screen-desktop">
			<Spinner size="large" />
		</div>
	),
});

const ReferralPage: React.FC = () => {
	const { getItem } = useLocalStorage("auth-storage");

	const localState = useMemo<{ state: WalletStore; }>(() => getItem(), [getItem]);

	const [openModalInfo, setOpenModalInfo] = useReferralStore((state) => [
		state.openModalInfo,
		state.setOpenModalInfo,
	]);
	const { connected } = useWallet();
	const router = useRouter();
	const pathName = usePathname();
	const refCode = localStorage.getItem("refCode");

	useEffect(() => {
		if (pathName === "/referral" && (!localState || !localState.state?.wallet?.walletAddress)) {
			router.push("/");
		}
	}, [connected, pathName, router, localState, refCode]);

	return (
		<div className="w-full bg-support-black overflow-hidden">
			<div className="lg:grid lg:grid-cols-4">
				<div className="lg:col-span-1 border-r border-divider-secondary">
					<OverviewTabs />
				</div>
				<div className="lg:col-span-3 lg:m-5 rounded-md border border-divider-secondary bg-background-tertiary h-max">
					<StatisticBox />
				</div>
			</div>
			<ModalInfo
				open={openModalInfo}
				handleClose={() => setOpenModalInfo(false)}
				userInfo={localState?.state?.wallet as Wallet}
			/>
		</div>
	);
};

export default ReferralPage;
