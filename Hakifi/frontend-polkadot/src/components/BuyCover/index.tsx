"use client";

import { Insurance, InsurancePlan } from "@/@type/insurance.type";
import { MarketPair, PairDetail } from "@/@type/pair.type";
import useEventSocket from "@/hooks/useEventSocket";
import { useIsTablet } from "@/hooks/useMediaQuery";
import useInsuranceStore from "@/stores/insurance.store";
import useMarketStore from "@/stores/market.store";
import { cn } from "@/utils";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useReducer, useState } from "react";
import ChartLoader from "./Loader/ChartLoader";
import FavoritesLoader from "./Loader/FavoritesLoader";
import InformationLoader from "./Loader/InformationLoader";
import { useWallet } from "@suiet/wallet-kit";
import useBalance from "@/hooks/useBalance";
import { useAccount } from "wagmi";
type BuyCoverProps = {
	plans: InsurancePlan[];
	symbol: string;
	pair: PairDetail;
	marketPairs: MarketPair[];
};

const Chart = dynamic(() => import("@/components/BuyCover/Chart"), {
	loading: () => <ChartLoader />,
	ssr: false,
});

const PlaceOrder = dynamic(() => import("@/components/BuyCover/PlaceOrder"), {
	// loading: () => <LoaderPlaceOrder className="mt-4" />,
	ssr: false,
});

const Contract = dynamic(() => import('@/components/BuyCover/Contract'), {
	// loading: () => <LoaderPlaceOrder className="mt-4" />,
	ssr: false,
});

const Favorites = dynamic(() => import('@/components/BuyCover/Favorites'), {
	loading: () => <FavoritesLoader />,
	ssr: false,
});

const Information = dynamic(() => import("@/components/BuyCover/Information"), {
	loading: () => <InformationLoader />,
	ssr: false,
});

const BuyCover = ({ symbol, pair, marketPairs, plans }: BuyCoverProps) => {
	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const setMarketPairs = useMarketStore((state) => state.setMarketPairs);
	const {isConnected} = useAccount()
	const { refetch } = useBalance();
	const isTablet = useIsTablet();
	const { setPlans } = useInsuranceStore((state) => state);
	const [getInsuranceOpening, getInsuranceHistory] = useInsuranceStore(
		(state) => [state.getInsuranceOpening, state.getInsuranceHistory]
	);
	const getDataInsurances = useCallback(() => {
		getInsuranceOpening({ page: 1 });
		getInsuranceHistory({ page: 1 });
	}, []);

	useEffect(() => {
		setPlans(plans);
		setMarketPairs(marketPairs);
	}, [isConnected]);

	const [fullScreen, setFullScreen] = useState<boolean>(false);

	const handleFullScreenAction = (expand: boolean) => {
		setFullScreen(expand);
	};

	const [setInsuranceSelected] = useInsuranceStore((state) => [
		state.setInsuranceSelected,
	]);

	const cbCreated = useCallback((data: Insurance) => {
		console.log("Insurance is modified", data);
		getDataInsurances();
		setInsuranceSelected(data);
	}, []);

	const cbUpdated = (() => {
		console.log("Insurance is change status");
		getDataInsurances();
		forceUpdate();

		setTimeout(() => {
			refetch();
		}, 2000);
	});

	useEventSocket("insurance.created", cbCreated);
	useEventSocket("insurance.updated", cbUpdated);

	return (
		<>
			{/* Hot pair */}
			<section className="bg-background-tertiary">
				<Favorites />
			</section>

			<section className="bg-background-tertiary flex flex-col sm:flex-row border-t border-divider-secondary max-w-[100vw]">
				{/* Token information */}
				<section
					className={cn(
						!fullScreen ? "lg:max-w-[calc(100dvw-420px)] w-full" : "w-full"
					)}
				>
					<section className="px-4">
						<Information marketPairs={marketPairs} symbol={symbol} />
					</section>
					<Chart
						symbol={symbol}
						marketPairs={marketPairs}
						fullScreen={fullScreen}
						setFullScreen={handleFullScreenAction}
					/>
					{!fullScreen && <Contract />}
				</section>
				{!isTablet && !fullScreen && (
					<section className="min-w-[420px] lg:max-w-1/4 w-full  px-4 sm:px-5 pt-4 pb-6 border-l border-divider-secondary">
						<PlaceOrder symbol={symbol} pair={pair} />
					</section>
				)}
			</section>
			{isTablet && <PlaceOrder symbol={symbol} pair={pair} />}

		</>
	);
};

export default BuyCover;
