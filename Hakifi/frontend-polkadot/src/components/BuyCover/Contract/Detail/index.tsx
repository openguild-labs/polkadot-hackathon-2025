"use client";

import { Insurance } from "@/@type/insurance.type";
import Button from "@/components/common/Button";
import ClipboardIcon from "@/components/common/Icons/ClipboardIcon";
import ClockIcon from "@/components/common/Icons/ClockIcon";
import CloseIcon from "@/components/common/Icons/CloseIcon";
import ShareIcon from "@/components/common/Icons/ShareIcon";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogOverlay,
} from "@/components/common/Modal/Dialog";
import { useNotification } from "@/components/common/Notification";
import { Separator } from "@/components/common/Separator";
import ToggleSwitch from "@/components/common/ToggleSwitch";
import { useIsTablet } from "@/hooks/useMediaQuery";
import useInsuranceStore from "@/stores/insurance.store";
import useMarketStore from "@/stores/market.store";
import { cn } from "@/utils";
import { STATE_INSURANCES } from "@/utils/constant";
import { copyToClipboard, shortenHexString } from "@/utils/helper";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Information from "../../Information";
import { CloseButton, CountdownWrapper } from "../utils";
import { HistoryInsurance, OpeningInsurance } from "./InsuranceInformation";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { set } from "date-fns";
import TagStatus from "@/components/common/TagStatus";

const Chart = dynamic(
	() => import("@/components/BuyCover/Contract/Detail/Chart"),
	{
		// loading: () => <LoaderChart className="mt-4" />,
		ssr: false,
	}
);

export type InsuranceInformation = Partial<Insurance> & {
	hashId: string;
	status: keyof typeof STATE_INSURANCES;
	openTime: Date;
	expireTime: Date;
	closeTime: Date;
};

const DetailInsuranceModal = () => {
	const [
		isOpenDetailModal,
		toggleDetailModal,
		insuranceSelected,
		setInsuranceSelected,
		toggleCloseModal,
		localToggleCharts,
		setLocalToggleCharts,
	] = useInsuranceStore((state) => [
		state.isOpenDetailModal,
		state.toggleDetailModal,
		state.insuranceSelected,
		state.setInsuranceSelected,
		state.toggleCloseModal,
		state.localToggleCharts,
		state.setLocalToggleCharts,
	]);
	const onmounted = useRef(true);

	const router = useRouter();
	const marketPairs = useMarketStore((state) => state.marketPairs);
	const [showChart, setShowChart] = useState(true);
	const toggleShowChart = useCallback(() => {
		setShowChart((pre) => {
			if (insuranceSelected) {
				const newInsurances = [
					...localToggleCharts,
					{ id: insuranceSelected?.id, flag: !pre },
				];
				setLocalToggleCharts(newInsurances);
			}
			return !pre;
		});
	}, [insuranceSelected]);

	const [fullScreen, setFullScreen] = useState<boolean>(false);

	useEffect(() => {
		const insuranceInfo = localToggleCharts?.find(
			(item) => item.id === insuranceSelected?.id
		);
		if (onmounted.current) {
			if (insuranceInfo) {
				console.log("exist", insuranceInfo);
				setShowChart(insuranceInfo.flag);
			} else setShowChart(true);

			onmounted.current = false;
		}
	}, [insuranceSelected]);

	const insurance = useMemo<InsuranceInformation>(() => {
		const expireTime = insuranceSelected?.expiredAt
			? new Date(insuranceSelected?.expiredAt)
			: new Date();
		const status = insuranceSelected?.state
			? insuranceSelected?.state
			: ("CLAIMED" as keyof typeof STATE_INSURANCES);
		const openTime = insuranceSelected?.createdAt
			? new Date(insuranceSelected?.createdAt)
			: new Date();
		const p_close = insuranceSelected?.p_close
			? Number(insuranceSelected?.p_close)
			: 0;
		const closeTime = insuranceSelected?.closedAt
			? new Date(insuranceSelected?.closedAt)
			: new Date();
		return {
			...insuranceSelected,
			hashId: insuranceSelected?.txhash
				? shortenHexString(insuranceSelected?.txhash as string, 12, 4)
				: "",
			expireTime,
			status,
			openTime,
			p_close,
			closeTime,
		};
	}, [insuranceSelected]);

	const isTablet = useIsTablet();
	const isHistory = useMemo(() => !!insurance.closedAt, [insuranceSelected]);

	const chartData = useMemo(() => {
		return {
			p_claim: insurance.p_claim,
			p_cancel: insurance.p_cancel,
			p_liquidation: insurance.p_liquidation,
			p_refund: insurance.p_refund,
			p_open: insurance.p_open,
			p_close: insurance.p_close,
			expiredAt: new Date(),
		};
	}, [insuranceSelected]);

	const handleBuybackAction = () => {
		router.push(`/buy-cover/${insurance.asset}USDT`);
		toggleDetailModal();
	};

	const handleCloseAction = () => {
		toggleDetailModal();
		toggleCloseModal();
	};

	const handleCloseModel = () => {
		toggleDetailModal();

		setInsuranceSelected(null);
	};

	const notifications = useNotification();
	const copyTooltipRef = useRef<any>();
	const handleCopy = (str: string) => {
		copyToClipboard(str);
		copyTooltipRef.current?.toggle(true);

		notifications.success("Copied");
	};

	return (
		<Dialog open={isOpenDetailModal} onOpenChange={handleCloseModel}>
			<DialogContent
				className={cn(
					"!p-0 !inset-x-0 !translate-x-0 !translate-y-0 !max-w-full !rounded-none !border-none  !fixed !bottom-0 !bg-transparent",
					isTablet && !fullScreen && "!overflow-y-scroll",
					!fullScreen ? "top-[57px] sm:!top-[65px]" : "!top-0"
				)}
				showCloseButton={false}>
				<DialogDescription asChild className="overflow-auto px-4 sm:!px-0">
					<section className="p-4 sm:p-0 bg-background-tertiary">
						{isTablet && (
							<section className="flex justify-end">
								<Button size="md" onClick={toggleDetailModal}>
									<CloseIcon className="size-6" />
								</Button>
							</section>
						)}
						{isTablet && (
							<section
								className={cn("flex flex-col gap-4 my-5", showChart && "mb-4")}>
								<section className="flex flex-col gap-2">
									<p className="flex text-title-20 items-center gap-2">
										Contract{" "}
										<span
											className={cn(
												insurance.side === ENUM_INSURANCE_SIDE.BULL
													? "text-positive"
													: "text-negative"
											)}>
											{insurance.asset} {insurance.side}
										</span>

										<TagStatus
											status={insurance.status}
										/>
									</p>

									<div className="text-body-14 text-typo-secondary flex items-center justify-start sm:justify-normal gap-2">
										<div>
											Contract ID:{" "}
											{shortenHexString(insurance.id as string, 5, 4)}
										</div>
										<Button size="md" onClick={() => handleCopy(insurance.id as string)}>
											<ClipboardIcon className="size-6" />
										</Button>
									</div>
									<div className="text-body-14 text-typo-secondary flex items-center justify-start sm:justify-normal gap-2">
										<div>
											HashID:{" "}
											{shortenHexString(insurance.hashId as string, 5, 4)}
										</div>
										<Button size="md" onClick={() => handleCopy(insurance.id as string)}>
											<ClipboardIcon className="size-6" />
										</Button>
									</div>
								</section>
								<section className="flex justify-between items-center gap-4">
									{!isHistory && (
										<section className="flex-2 flex items-center rounded py-3 px-7 bg-background-secondary gap-2 text-typo-accent text-body-14 justify-center">
											<ClockIcon className="size-5" />
											<CountdownWrapper date={insurance.expireTime} />
										</section>
									)}
									{/* <Button
										size="lg"
										variant="primary"
										className="flex gap-2 items-center justify-center flex-1">
										<ShareIcon />
										<span className="text-typo-tertiary">Share</span>
									</Button> */}
								</section>
								<section className="flex items-center gap-2 text-body-14 text-typo-primary justify-between border-t border-b border-divider-secondary py-4">
									<p>Chart </p>
									<ToggleSwitch
										onChange={toggleShowChart}
										defaultValue={showChart}
									/>
								</section>
								{/* <Separator /> */}
							</section>
						)}
						<section className="flex flex-col-reverse md:flex-row-reverse items-start">
							{!fullScreen ? (
								<section
									className={cn(
										"w-full sm:w-1/3 h-fit-screen-mobile  sm:h-fit-screen-desktop custom-scroll flex flex-col justify-between sm:p-5",
										!isTablet
											? "border-l border-t border-divider-secondary max-h-dvh"
											: "h-full"
									)}>
									<section
										className={cn(
											"flex flex-col gap-5",
											showChart &&
											isTablet &&
											"border-t border-divider-secondary pt-4 mt-10"
										)}>
										{!isTablet && (
											<>
												<section className="flex flex-col gap-2">
													<section className="flex justify-end">
														<Button size="md" onClick={toggleDetailModal}>
															<CloseIcon className="size-6" />
														</Button>
													</section>
													<p className="flex text-title-24 items-center gap-2">
														Contract{" "}
														<span
															className={cn(
																insurance.side === ENUM_INSURANCE_SIDE.BULL
																	? "text-positive"
																	: "text-negative"
															)}>
															{insurance.asset} {insurance.side}
														</span>

														<TagStatus
															status={insurance.status}
														/>
													</p>

													<div className="text-body-14 text-typo-secondary flex items-center justify-start sm:justify-normal gap-2">
														<div>Contract ID: {insurance.id}</div>
														<Button size="md" onClick={() => handleCopy(insurance.id as string)}>
															<ClipboardIcon className="size-6" />
														</Button>
													</div>
													<div className="text-body-14 text-typo-secondary flex items-center justify-start sm:justify-normal gap-2">
														<div>HashID: {insurance.hashId}</div>
														<Button size="md" onClick={() => handleCopy(insurance.hashId as string)}>
															<ClipboardIcon className="size-6" />
														</Button>
													</div>
												</section>
												<section className="flex justify-between items-center gap-4">
													{!isHistory && (
														<section className="flex-2 flex items-center rounded py-3 px-7 bg-background-secondary gap-2 text-typo-accent text-body-14 justify-center">
															<ClockIcon className="size-5" />
															<CountdownWrapper date={insurance.expireTime} />
														</section>
													)}
													{/* <Button
														size="lg"
														variant="primary"
														className="flex gap-2 items-center justify-center flex-1">
														<ShareIcon />
														<span className="text-typo-tertiary">Share</span>
													</Button> */}
												</section>
												<Separator />
											</>
										)}
										<section className="flex items-center justify-between">
											<span className="text-typo-primary text-body-16">
												Contract detail
											</span>
											{!isTablet && (
												<section className="flex items-center gap-2 text-body-14 text-typo-primary">
													<ToggleSwitch
														onChange={toggleShowChart}
														defaultValue={showChart}
													/>{" "}
													Chart
												</section>
											)}
										</section>
										<section className="flex flex-col gap-4">
											<section
												className={cn(
													"p-4 overflow-y-auto bg-support-black rounded custom-scroll border border-divider-secondary",
													isTablet ? "h-full" : "max-h-[calc(100dvh-535px)]"
												)}>
												{isHistory ? (
													<HistoryInsurance insurance={insurance} />
												) : (
													<OpeningInsurance insurance={insurance} />
												)}
											</section>
											<section className="text-body-14 text-typo-secondary">
												<p>
													(*) Margin refund condition: At expiration time, Market
													price is between Refund price and Claim price.
												</p>
												<p>
													(**) Contract liquidation condition: Market price
													reaches Liquid. price.
												</p>
											</section>
										</section>
									</section>
									<section
										className={cn(isTablet ? "mt-5" : "sticky bottom-0")}>
										{isHistory ? (
											<Button
												size="lg"
												variant="primary"
												className="w-full justify-center"
												onClick={handleBuybackAction}>
												Buy cover again
											</Button>
										) : (
											<CloseButton
												onClick={handleCloseAction}
												symbol={`${insurance.asset}USDT`}
												pCancel={insurance.p_cancel as number}
												pClaim={insurance.p_claim as number}
												title="Close contract"
												side={insurance.side}
												state={insurance.state as string}
												className="w-full !text-body-16 !py-3"
											/>
										)}
									</section>
								</section>
							) : null}
							<section
								className={cn(
									"w-full size-full bg-transparent",
									!isTablet && "border-t border-divider-secondary",
									// showChart && "mb-10",
									fullScreen ? "w-full z-[60]" : "sm:w-2/3"
								)}>
								{showChart ? (
									<>
										<section
											className={cn(
												"bg-background-tertiary",
												!isTablet && "px-5"
											)}>
											<Information
												marketPairs={marketPairs}
												symbol={insurance.asset + "USDT"}
											/>
										</section>
										<Chart
											symbol={`${insurance.asset}USDT`}
											data={chartData}
											isHistory={isHistory}
											fullScreen={fullScreen}
											setFullScreen={(fs: boolean) => setFullScreen(fs)}
										/>
									</>
								) : null}
							</section>
						</section>
					</section>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};

export default DetailInsuranceModal;
