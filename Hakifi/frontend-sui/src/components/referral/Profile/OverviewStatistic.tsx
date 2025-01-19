import React from "react";
import { formatNumber } from "@/utils/format";

import useReferralStore from "@/stores/referral.store";
import { UserStats } from "../type";

const listOverStatistic: {
	label: string;
	value: keyof UserStats;
	icon?: string;
}[] = [
	{
		label: "Payback",
		value: "totalPayback",
		icon: "/assets/images/cryptos/usdt.png",
	},
	{
		label: "Margin",
		value: "totalMargin",
		icon: "/assets/images/cryptos/usdt.png",
	},
	{
		label: "opened",
		value: "totalInsurance",
	},
	{
		label: "closed",
		value: "totalInsuranceClosed",
	},
	{
		label: "claimed",
		value: "totalInsuranceClaimed",
	},
	{
		label: "refunded",
		value: "totalInsuranceRefunded",
	},
	{
		label: "liquidated",
		value: "totalInsuranceLiquidated",
	},
];
const OverviewStatistic = () => {
	const [dataStats] = useReferralStore((state) => [state.userStats]);

	return (
		<div className="w-full py-5">
			<div className="grid grid-cols-1 gap-y-3">
				{listOverStatistic.map((item) => {
					const title = item.label;
					const value = formatNumber(dataStats[item.value], 2) || 0;
					return (
						<div className="w-full" key={item.value}>
							<div className="flex flex-row justify-between">
								<p className="lg:text-sm text-xs text-typo-secondary capitalize">{title}</p>
								<p className="lg:text-sm text-xs text-typo-primary flex items-center justify-start gap-x-1">
									{value}
									{item.icon ? (
										<img src={item.icon} alt="icon" className="w-4 h-4" />
									) : null}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default OverviewStatistic;
