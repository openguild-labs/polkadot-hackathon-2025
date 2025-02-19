"use client";
/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from "react";
import { formatNumber } from "@/utils/format";
import { getStats } from "@/apis/general.api";

type TData = {
	totalUsers: number;
	totalContracts: number;
	totalQCovered: number;
	totalPayback: number;
};

const Statistic = () => {
	const [dataStatistic, setDataStatistic] = useState<TData>({
		totalUsers: 0,
		totalContracts: 0,
		totalPayback: 0,
		totalQCovered: 0,
	});
	const titles: {
		title: string;
		value: keyof TData;
		prefix?: string;
	}[] = [
		{
			title: "Total Payback",
			value: "totalPayback",
			prefix: "$",
		},
		// {
		// 	title: "Insured Value",
		// 	value: "totalQCovered",
		// 	prefix: "$",
		// },
		{ title: "Contracts", value: "totalContracts" },
		{ title: "Users", value: "totalUsers" },
	];
	const handleGetDataStats = async () => {
		return await getStats()
			.then((res) => {
				if (res) {
					setDataStatistic(res as unknown as TData);
				}
			})
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		handleGetDataStats();
	}, []);

	return (
		<div className="rounded-md border-l-8 border-r-8 border-divider-primary max-w-desktop items-center bg-background-secondary lg:py-8 py-4 shadow-md flex lg:justify-between justify-center flex-wrap border gap-y-5 lg:px-5 px-0">
			{titles.map((item) => {
				return (
					<div
						className="h-max lg:w-[320px] w-[168px] text-center"
						key={item.value}
					>
						<div className="lg:text-body-16 text-sm text-typo-primary lg:leading-[24px] leading-[22px]">{item.title}</div>
						<div className="display-2-desktop text-typo-accent lg:text-[40px] lg:leading-[40px] leading-[42px] text-3xl font-determination tracking-[2.4px]">
							{item?.prefix || null}
							{formatNumber(dataStatistic[item.value], 2)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Statistic;
