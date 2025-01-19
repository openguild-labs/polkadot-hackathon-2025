"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { formatNumber } from "@/utils/format";
import { getSmartContractStats } from "@/apis/general.api";
import dynamic from "next/dynamic";
import { INSURANCE_ADDRESS, SCILABS_ADDRESS } from "@/web3/constants";
import Spinner from "../common/Spinner";
const PoolProcessDesktop = dynamic(() => import("./PoolProcessDesktop"), {
	ssr: false,
	loading: () => (
		<div className="flex w-full items-center justify-center">
			<Spinner size="large" />
		</div>
	),
});
const PoolProcessMobile = dynamic(() => import("./PoolProcessMobile"), {
	ssr: false,
	loading: () => (
		<div className="flex w-full items-center justify-center">
			<Spinner size="large" />
		</div>
	),
});

type TData = {
	claimPool: number;
	marginPool: number;
	hakifiFund: number;
	scilabsFund: number;
	q_refund: number;
	q_claim: number;
};
const MapPool = () => {
	const isMobile = useIsMobile();
	const [dataPool, setDataPool] = useState<TData>({
		claimPool: 0,
		marginPool: 0,
		hakifiFund: 0,
		scilabsFund: 0,
		q_refund: 0,
		q_claim: 0,
	});
	const handleGetPoolData = async () => {
		return await getSmartContractStats()
			.then((res) => {
				if (res) {
					setDataPool(res as unknown as TData);
				}
			})
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		handleGetPoolData();
	}, []);

	return (
		<div className="max-w-desktop w-full lg:px-0">
			<div className="max-w-desktop flex w-full flex-col items-center">
				<div className="flex w-full flex-col items-center font-determination justify-center gap-y-3 text-center">
					<div className="text-3xl font-semibold lg:text-5xl text-typo-primary">
						DISCLOSURE VIA <span className="text-typo-accent">ON-CHAIN</span>
						<p>DATA PROCESSING</p>
					</div>
					<div className="lg:text-base text-xs !text-typo-secondary font-saira">
						Real-time monitor the value of available contracts, the expected
						amount of payback, as well as the reserve fund of{" "}
						<span className="text-typo-accent">Hakifi</span>
					</div>
				</div>
			</div>
			<div className="mt-16">
				{isMobile ? (
					<PoolProcessMobile
						marginPool={formatNumber(dataPool.marginPool)}
						claimPool={formatNumber(dataPool.claimPool)}
						hakifiFund={formatNumber(dataPool.hakifiFund)}
						sciFund={formatNumber(dataPool.scilabsFund)}
						qRefund={formatNumber(dataPool.q_refund)}
						qSupport={formatNumber(dataPool.q_claim)}
						// marginAddress={`${CHAIN_SCAN}/address/${INSURANCE_ADDRESS}`}
						// claimAddress={`${CHAIN_SCAN}/address/${INSURANCE_ADDRESS}`}
						// hakifiAddress={`${CHAIN_SCAN}/address/${INSURANCE_ADDRESS}`}
						// sciAddress={`${CHAIN_SCAN}/address/${SCILABS_ADDRESS}`}
					/>
				) : (
					<PoolProcessDesktop
						marginPool={formatNumber(dataPool.marginPool)}
						claimPool={formatNumber(dataPool.claimPool)}
						hakifiFund={formatNumber(dataPool.hakifiFund)}
						sciFund={formatNumber(dataPool.scilabsFund)}
						qRefund={formatNumber(dataPool.q_refund)}
						qSupport={formatNumber(dataPool.q_claim)}
						// marginAddress={`${CHAIN_SCAN}/address/${INSURANCE_ADDRESS}`}
						// claimAddress={`${CHAIN_SCAN}/address/${INSURANCE_ADDRESS}`}
						// hakifiAddress={`${CHAIN_SCAN}/address/${INSURANCE_ADDRESS}`}
						// sciAddress={`${CHAIN_SCAN}/address/${SCILABS_ADDRESS}`}
					/>
				)}
			</div>
		</div>
	);
};

export default MapPool;
