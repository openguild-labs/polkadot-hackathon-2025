"use client";

/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-fallthrough */
/* eslint-disable no-empty */
import clsx from "clsx";
import dayjs from "dayjs";
import React, { memo, useEffect, useState } from "react";
import { formatNumber } from "@/utils/format";
import { TDataTransaction } from "./type";
import styles from "./styles/Onchain.module.scss";
import TagStatus from "../common/TagStatus";
import { getTransactions } from "@/apis/general.api";
import { updateArray, substring } from "@/utils/helper";
import Copy from "../common/Copy";

interface IOnchainActivity {
	className?: string;
	showTitle?: boolean;
}
type TData = {
	listBullInsurances: TDataTransaction[];
	listBearInsurances: TDataTransaction[];
};
const LIMIT_EVENT_LOGS = 20;
const OnchainActivity = memo(
	({ className, showTitle = false }: IOnchainActivity) => {
		const [dataSource, setDataSource] = useState<TData>({
			listBearInsurances: [],
			listBullInsurances: [],
		});
		const getOnchain = async () => {
			return await getTransactions().then((res) => {
				if (res) {
					setDataSource({
						listBearInsurances: updateArray(
							res.listBearInsurances,
							LIMIT_EVENT_LOGS
						),
						listBullInsurances: updateArray(
							res.listBullInsurances,
							LIMIT_EVENT_LOGS
						),
					});
				}
			});
		};
		useEffect(() => {
			getOnchain();
		}, []);

		const renderContent = (data: TDataTransaction[]) => {
			return data.map((item: TDataTransaction, idx: number) => {
				item.id === "664b229bee9acbfaab615336" && console.log(item.state)
				return (
					<div
						className="mx-3 min-w-[320px] border hover:border-divider-primary hover:bg-background-secondary border-divider-secondary rounded-[4px] cursor-pointer whitespace-nowrap bg-transparent px-3 py-3 shadow sm:px-4"
						key={idx}
					>
						<div className="w-full rounded-md flex justify-between items-center">
							<TagStatus status={item.state} />
							<div className="text-gray flex items-center justify-between space-x-4 text-xs font-semibold">
								<div>
									<Copy
										prefix={substring(item?.id, 6)}
										text={item?.id}
										styleContent="text-typo-secondary lg:text-base text-sm"
									/>
								</div>
							</div>
						</div>
						<div className="flex flex-col space-y-1 pt-4">
							<div className="flex items-center justify-between font-semibold">
								<div className="flex items-center space-x-2">
									<span className="text-sm text-typo-primary">
										{item?.asset}
										<span className="text-typo-secondary">/USDT</span>
									</span>
								</div>
								<span className="lg:text-base text-sm text-typo-primary">
									+{formatNumber(item?.q_claim, 2)}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<p
									className={clsx("text-xs capitalize", {
										"text-negative": item?.side === "BEAR",
										"text-positive": item?.side === "BULL",
									})}
								>
									{item?.side === "BEAR" ? "Bear" : "Bull"}
								</p>
								<p className="text-typo-secondary text-xs">
									{item?.margin | 0} USDT
								</p>
							</div>
						</div>
					</div>
				)

			});
		};
		return (
			<section className={clsx("py-11 sm:py-[4rem]", className)}>
				{showTitle ? (
					<p className="px-4 lg:text-2xl text-xl font-bold text-typo-primary lg:px-5">
						{"market:onchain_activities"}
					</p>
				) : null}
				<div className="flex flex-col gap-y-5">
					{dataSource.listBullInsurances?.length > 0 ? (
						<div className="w-full overflow-hidden" key={"bull"}>
							<div className={styles["loop-looper-rtl"]}>
								<div className="flex items-center">
									{renderContent(dataSource.listBullInsurances)}
								</div>
							</div>
						</div>
					) : null}
					{dataSource.listBearInsurances?.length > 0 ? (
						<div className="w-full overflow-hidden" key={"bear"}>
							<div className={styles["loop-looper-ltr"]}>
								<div className="flex items-center">
									{renderContent(dataSource.listBearInsurances)}
								</div>
							</div>
						</div>
					) : null}
				</div>
			</section>
		);
	}
);

export default OnchainActivity;
