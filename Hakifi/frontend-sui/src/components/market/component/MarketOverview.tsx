"use client";

import { useEffect, useState } from "react";
import { TYPE_CARD_MARKET } from "../constants";
import CardMarket from "./CardMarket";
import { getMarketOverview } from "@/apis/general.api";
import { DataOverviewMarket } from "../type";

export default function MarketOverview() {
	const [data, setData] = useState<DataOverviewMarket>({
		topContracts: [],
		topCoverAmount: [],
		topGainers: [],
		topPaybackUsers: [],
	});

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const handleGetMarketOverview = async () => {
		return await getMarketOverview()
			.then((res) => {
				if (res as unknown as DataOverviewMarket) {
					setData(res);
					setIsLoading(false);
				}
			})
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		handleGetMarketOverview();
	}, []);

	return (
		<section className="mt-4 lg:mt-5">
			<h3 className="text-xl lg:text-[28px] font-normal font-determination text-typo-accent lg:leading-[42px] leading-[20px]">
				MARKET OVERVIEW
			</h3>
			<div className="mt-4 flex flex-col lg:grid lg:grid-cols-4 items-center gap-y-2 lg:gap-x-3">
				<CardMarket
					className="w-full lg:col-span-1 h-full"
					title={"Top Contracts"}
					headerCell={["Contract", "Market Price", "Quantities"]}
					dataCell={data.topContracts}
					type={TYPE_CARD_MARKET.CONTRACT}
					isLoading={isLoading}
				/>
				<CardMarket
					className="w-full lg:col-span-1 h-full"
					title={"Top Margin"}
					headerCell={["Contract", "Market Price", "Margin"]}
					dataCell={data.topCoverAmount}
					type={TYPE_CARD_MARKET.AMOUNT}
					isLoading={isLoading}
					isMargin={true}
				/>
				<CardMarket
					className="w-full lg:col-span-1 h-full"
					title={"Top Claim Amount"}
					headerCell={["Contract", "Market Price", "Claim Amount"]}
					dataCell={data.topGainers}
					type={TYPE_CARD_MARKET.AMOUNT}
					isLoading={isLoading}
				/>
				<CardMarket
					className="w-full lg:col-span-1 h-full"
					title={"Top Payback Users"}
					headerCell={["User", "Total contracts", "Total Payback"]}
					dataCell={data.topPaybackUsers}
					type={TYPE_CARD_MARKET.USER}
					isLoading={isLoading}
				/>
			</div>
		</section>
	);
}
