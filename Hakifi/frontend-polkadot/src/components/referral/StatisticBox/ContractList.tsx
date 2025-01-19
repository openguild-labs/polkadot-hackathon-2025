"use client";
import { Insurance } from "@/@type/insurance.type";
import StatusDropdown from "@/components/BuyCover/Contract/TabHistory/StatusDropdown";
import {
	DateExpiredWrapper,
	PnlWrapper,
	PriceExpiredWrapper,
	QClaimWrapper,
	TooltipHeaderWrapper,
} from "@/components/BuyCover/Contract/utils";
import TickerWrapper from "@/components/BuyCover/Favorites/TickerWrapper";
import CoinListWrapper from "@/components/common/Accordion/CoinItem";
import Button from "@/components/common/Button";
import { DateRangePicker } from "@/components/common/Calendar/DateRangPicker";
import Copy from "@/components/common/Copy";
import DataTable from "@/components/common/DataTable";
import EmptyData from "@/components/common/EmptyData";
import ArrowUpDownIcon from "@/components/common/Icons/ArrowUpDownIcon";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import CloseIcon from "@/components/common/Icons/CloseIcon";
import ExternalLinkIcon from "@/components/common/Icons/ExternalLinkIcon";
import Pagination from "@/components/common/Pagination";
import Tag from "@/components/common/Tag";
import TooltipCustom from "@/components/common/Tooltip";
import { useIsMobile } from "@/hooks/useMediaQuery";
import useInsuranceStore from "@/stores/insurance.store";
import useWalletStore from "@/stores/wallet.store";
import { cn } from "@/utils";
import { MODE, STATUS_DEFINITIONS } from "@/utils/constant";
import { formatNumber } from "@/utils/format";
import { shortenHexString } from "@/utils/helper";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import clsx from "clsx";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import AssetDropdown from "../../BuyCover/Contract/Components/AssetsDropdown";
import SearchIcon from "../../common/Icons/SearchIcon";
import Input from "../../common/Input";
import FilterContractList from "../drawer/FilterContractList";
import { useWallet } from "@suiet/wallet-kit";
import { useAccount } from "wagmi";

dayjs.extend(utc);
dayjs.extend(timezone);

const ContractList = () => {
	// const { connected } = useWallet();
	const { isConnected } = useAccount();
	const wallet = useWalletStore((state) => state.wallet);
	const [status, setStatus] = useState<string | undefined>(undefined);

	const [
		setPagination,
		allInsurances,
		totalInsurances,
		getAllInsurance,
		currentPage,
		toggleDetailModal,
		setInsuranceSelected,
	] = useInsuranceStore((state) => [
		state.setPagination,
		state.allInsurances,
		state.totalInsurances,
		state.getAllInsurance,
		state.currentPage,
		state.toggleDetailModal,
		state.setInsuranceSelected,
	]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const isLogging = useWalletStore((state) => state.isLogging);
	const [asset, setAsset] = useState<string>("all");
	const inputRef = useRef(null);
	const [openTime, setOpenTime] = useState<DateRange | undefined>(undefined);
	const [expireTime, setExpireTime] = useState<DateRange | undefined>(
		undefined
	);
	const isMobile = useIsMobile();
	const [searchTX, setSetsearchTX] = useState("");
	const onChangeSearchTX = (e: React.FormEvent<HTMLInputElement>) => {
		setSetsearchTX(e.currentTarget.value);
	};

	const { expiredFrom, expiredTo } = useMemo(() => {
		if (expireTime?.from !== undefined) {
			return {
				expiredFrom: dayjs(expireTime.from).startOf("day").toDate(),
				expiredTo: dayjs(expireTime.to).endOf("day").toDate(),
			};
		}
		return {
			expiredFrom: undefined,
			expiredTo: undefined,
		};
	}, [expireTime]);

	const { createdFrom, createdTo } = useMemo(() => {
		if (openTime?.from !== undefined) {
			return {
				createdFrom: dayjs(openTime.from).startOf("day").toDate(),
				createdTo: dayjs(openTime.to).endOf("day").toDate(),
			};
		}
		return {
			createdFrom: undefined,
			createdTo: undefined,
		};
	}, [openTime]);

	useEffect(() => {
		if (isConnected) {
			getAllInsurance({
				page: Number(currentPage || 1),
				sort:
					sorting
						.map((item: any) => `${item.desc ? "-" : ""}${item.id}`)
						.join("") || undefined,
				q: searchTX || undefined,
				expiredFrom: expiredFrom as unknown as Date,
				expiredTo: expiredTo as unknown as Date,
				createdFrom: createdFrom as unknown as Date,
				createdTo: createdTo as unknown as Date,
				asset: asset !== "all" ? asset : undefined,
				state: status,
			});
		}
	}, [
		isConnected,
		currentPage,
		sorting,
		searchTX,
		openTime,
		expireTime,
		asset,
		getAllInsurance,
		expiredFrom,
		expiredTo,
		createdFrom,
		createdTo,
		wallet,
		status,
	]);
	const handleOnClickInsurance = (data: Insurance) => {
		toggleDetailModal();
		setInsuranceSelected(data);
	};

	const columns: ColumnDef<Insurance>[] = useMemo(
		() => [
			{
				accessorKey: "asset",
				header: ({ column }) => {
					const isSort =
						typeof column.getIsSorted() === "boolean"
							? ""
							: column.getIsSorted() === "asc"
								? false
								: true;
					return (
						<Button
							size="sm"
							className="flex items-center gap-2"
							onClick={() => {
								column.toggleSorting(column.getIsSorted() === "asc");
							}}>
							Pair
							<ArrowUpDownIcon sort={isSort} height={14} width={14} />
						</Button>
					);
				},
				cell: ({ row }) => {
					const token = row.getValue("token") as {
						attachment: string;
						name: string;
					};
					return (
						<div className="text-body-12 flex items-center gap-2">
							<Image
								src={token.attachment}
								width={24}
								height={24}
								alt="token"
							/>
							<div className="flex items-center gap-1">
								<span className="text-typo-primary">
									{row.getValue("asset")}
								</span>
								/<span>USDT</span>
							</div>
						</div>
					);
				},
				meta: {
					width: 120,
				},
			},
			{
				accessorKey: "side",
				header: "Side",
				meta: {
					width: 100,
				},
				cell: ({ row }) => {
					const side = row.getValue("side") as string;
					return (
						<div
							className={clsx(
								"text-body-12 text-typo-primary px-3 flex justify-center items-center w-fit rounded-sm h-5",
								side === MODE.BULL ? "bg-positive-label" : "bg-negative-label"
							)}>
							{side}
						</div>
					);
				},
			},
			{
				accessorKey: "expiredAt",
				header: ({ column }) => {
					const isSort =
						typeof column.getIsSorted() === "boolean"
							? ""
							: column.getIsSorted() === "asc"
								? false
								: true;
					return (
						<Button
							size="sm"
							className="flex items-center gap-2"
							onClick={() => {
								column.toggleSorting(column.getIsSorted() === "asc");
							}}>
							Expire in
							<ArrowUpDownIcon sort={isSort} height={14} width={14} />
						</Button>
					);
				},
				meta: {
					width: 185,
				},
				cell: ({ row }) => (
					<DateExpiredWrapper
						expired={row.getValue("state") !== "AVAILABLE" ? row.getValue("closedAt") : row.getValue("expiredAt")}
						isCooldown={true}
					/>
				),
			},
			{
				accessorKey: "pnl",
				header: "PnL",
				meta: {
					width: 180,
				},
				cell: ({ row }) => (
					<PnlWrapper
						margin={row.getValue("margin")}
						q_claim={row.getValue("q_claim")}
						state={row.getValue("state")}
					/>
				),
			},
			{
				accessorKey: "margin",
				header: ({ column }) => {
					const isSort =
						typeof column.getIsSorted() === "boolean"
							? ""
							: column.getIsSorted() === "asc"
								? false
								: true;
					return (
						<TooltipHeaderWrapper
							title="Margin"
							tooltip="Margin"
							onClick={() => {
								column.toggleSorting(column.getIsSorted() === "asc");
							}}
							suffix={<ArrowUpDownIcon className="ml-2" sort={isSort} />}
						/>
					);
				},
				meta: {
					width: 90,
				},
				cell: ({ row }) => (
					<div className="text-typo-primary">
						{formatNumber(row.getValue("margin"))}
					</div>
				),
			},
			// Command on demandưw
			// {
			// 	accessorKey: "q_covered",
			// 	header: ({ column }) => {
			// 		const isSort =
			// 			typeof column.getIsSorted() === "boolean"
			// 				? ""
			// 				: column.getIsSorted() === "asc"
			// 					? false
			// 					: true;
			// 		return (
			// 			<TooltipHeaderWrapper
			// 				title="Insured Value"
			// 				tooltip="Insured Value"
			// 				onClick={() => {
			// 					column.toggleSorting(column.getIsSorted() === "asc");
			// 				}}
			// 				suffix={<ArrowUpDownIcon height={14} width={14} sort={isSort} />}
			// 				className="flex items-center"
			// 			/>
			// 		);
			// 	},
			// 	meta: {
			// 		width: 150,
			// 	},
			// 	cell: ({ row }) => (
			// 		<div className="text-typo-primary">
			// 			{formatNumber(row.getValue("q_covered"))}
			// 		</div>
			// 	),
			// },
			{
				accessorKey: "state",
				header: "Status",
				cell: ({ row }) => {
					const { variant, title } =
						STATUS_DEFINITIONS[row.getValue("state") as string];
					return <Tag variant={variant} text={title} />;
				},
				meta: {
					width: 160,
				},
			},
			{
				accessorKey: "id",
				header: "Contract ID",
				meta: {
					width: 150,
				},
				cell: ({ row }) => {
					return row.getValue("id") ? (
						<a className="text-support-white flex items-center gap-2" href="#">
							{shortenHexString(row.getValue("id") as string, 5, 4)}
						</a>
					) : null;
				},
			},
			{
				accessorKey: "q_claim",
				header: "",
				meta: {
					show: false,
				},
			},
			{
				accessorKey: "token",
				header: "",
				meta: {
					show: false,
				},
			},
			{
				accessorKey: "closedAt",
				header: "",
				meta: {
					show: false,
				},
			},
		],
		[]
	);
	return (
		<div
			className={cn("flex flex-col", {
				"": allInsurances.length > 0,
			})}>
			<div className="lg:flex w-full lg:items-center lg:justify-between lg:border-b lg:border-divider-secondary lg:pb-4">
				{isMobile === true ? (
					<FilterContractList sorting={sorting} />
				) : (
					<div className="flex items-center w-full gap-x-3">
						<section className="w-[200px]">
							<AssetDropdown
								handleSetAsset={(pair: string) => {
									if (pair === asset) {
										setAsset("");
									} else {
										setAsset(pair);
										setPagination(1);
									}
								}}
								asset={asset}
								classTrigger="hover:bg-background-secondary"
							/>
						</section>
						<section className="w-[200px]">
							<StatusDropdown
								status={status}
								handleSetStatus={(status: string | undefined) => {
									setStatus(status);
									setPagination(1);
								}}
								classContent="!w-[200px]"
							/>
						</section>
						<div className="flex items-center justify-between gap-1 rounded-md border border-divider-secondary px-2 py-[9px] text-xs hover:bg-background-secondary hover:border-background-primary w-[240px]">
							<DateRangePicker
								onChange={(range: any) => {
									if (range) {
										setOpenTime(range);
									}
								}}
								className="text-sm w-full ">
								<div className="flex items-center w-full justify-between rounded-md gap-x-2 text-typo-secondary ">
									{openTime?.from ? (
										<Button
											onClick={() =>
												setOpenTime({ from: undefined, to: undefined })
											}
											className="flex items-center justify-center gap-x-1 "
											size="md">
											<p>
												{dayjs(openTime.from).format("DD/MM/YYYY")} -
												{dayjs(openTime.to).format("DD/MM/YYYY")}
											</p>
											{openTime?.from ? (
												<CloseIcon width={16} height={16} />
											) : null}
										</Button>
									) : (
										<p className="text-sm">Select open time</p>
									)}
									<CalendarIcon className="w-4 h-4" color="currentColor" />
								</div>
							</DateRangePicker>
						</div>

						<div className="flex items-center gap-1 rounded-md border border-divider-secondary px-2 py-[9px] text-xs hover:bg-background-secondary  hover:border-background-primary w-[240px]">
							<DateRangePicker
								onChange={(range: any) => {
									if (range) {
										setExpireTime(range);
									}
								}}
								className="text-sm w-full rounded-md ">
								<div className="flex items-center justify-between w-full rounded-md gap-x-2 text-typo-secondary">
									{expireTime?.from ? (
										<Button
											onClick={() =>
												setExpireTime({ from: undefined, to: undefined })
											}
											className="flex items-center justify-center gap-x-1 text-sm"
											size="md">
											<p>
												{dayjs(expireTime.from).format("DD/MM/YYYY")} -
												{dayjs(expireTime.to).format("DD/MM/YYYY")}
											</p>

											{expireTime?.from ? (
												<CloseIcon width={16} height={16} />
											) : null}
										</Button>
									) : (
										<p className="text-sm">Select expire time</p>
									)}
									<CalendarIcon className="w-4 h-4" color="currentColor" />
								</div>
							</DateRangePicker>
						</div>

						<Input
							prefix={<SearchIcon className="w-4 h-4" />}
							onChange={onChangeSearchTX}
							ref={inputRef}
							value={searchTX}
							prefixClassName="!border-l-0"
							size="lg"
							wrapperClassInput="rounded-md border border-divider-secondary hover:border-background-primary  focus:ring-0"
							placeholder="Search contract ID"
							className="text-sm"
							classFocus="border-background-primary"
						/>
					</div>
				)}
			</div>
			{!isMobile ? (
				<DataTable
					columns={columns}
					data={allInsurances || []}
					total={totalInsurances}
					setSorting={setSorting}
					sorting={sorting}
					onChangePagination={(value) => setPagination(value)}
					classNameWrapper="w-full overflow-x-auto"
					onClickRow={handleOnClickInsurance}
					styleHeader=""
				/>
			) : (
				<section
					className={clsx("flex flex-col w-full mt-5", {
						"gap-4": allInsurances?.length > 0,
					})}>
					{allInsurances?.length > 0 ? (
						allInsurances.map((insurance) => {
							const { variant, title } = STATUS_DEFINITIONS[insurance.state];
							return (
								<CoinListWrapper
									key={insurance.id}
									content={
										<section className="flex flex-col gap-3">
											<div className="flex items-center justify-between text-body-12">
												<TooltipCustom
													content={<p className="text-xs">Expire time</p>}
													title={
														<p className="text-typo-secondary text-xs border-b border-dashed border-divider-secondary">
															Expire time
														</p>
													}
													showArrow={true}
												/>
												<DateExpiredWrapper
													expired={dayjs(insurance.expiredAt).toDate()}
													isCooldown={true}
												/>
											</div>
											<div className="flex items-center justify-between text-body-12">
												<p className="text-typo-secondary text-xs border-b border-dashed border-divider-secondary">
													HashID
												</p>
												<div className="flex items-center gap-1">
													<Copy
														text={insurance.id}
														prefix={insurance.id}
														styleContent="text-typo-primary text-xs"
													/>
												</div>
											</div>
											<div className="flex items-center justify-between text-body-12">
												<TooltipCustom
													content={<p className="text-xs">Open price</p>}
													title={
														<p className="text-typo-secondary text-xs border-b border-dashed border-divider-secondary">
															P-Open
														</p>
													}
													showArrow={true}
												/>
												<p className="text-typo-primary">
													{formatNumber(insurance.p_open)}
												</p>
											</div>
											<div className="flex items-center justify-between text-body-12">
												<TooltipCustom
													content={
														<p className="text-xs">Status of contract</p>
													}
													title={
														<p className="text-typo-secondary text-xs border-b border-dashed border-divider-secondary">
															Status
														</p>
													}
													showArrow={true}
												/>
												<Tag variant={variant} text={title} />
											</div>
											<div className="flex items-center justify-between text-body-12">
												<TooltipCustom
													content={<p className="text-xs">Claim price</p>}
													title={
														<p className="text-typo-secondary text-xs border-b border-dashed border-divider-secondary">
															P-Claim
														</p>
													}
													showArrow={true}
												/>
												<p className="text-typo-primary">
													{formatNumber(insurance.p_claim)}
												</p>
											</div>
											<div className="flex items-center justify-between text-body-12">
												<TooltipCustom
													content={<p className="text-xs">Market price</p>}
													title={
														<p className="text-typo-secondary text-xs border-b border-dashed border-divider-secondary">
															P-Market
														</p>
													}
													showArrow={true}
												/>
												<TickerWrapper
													jump
													symbol={`${insurance.asset}USDT`}
													decimal={8}
												/>
											</div>
											<div className="flex items-center justify-between text-body-12">
												<TooltipCustom
													content={<p className="text-xs">Liquid. price</p>}
													title={
														<p className="text-typo-secondary text-xs border-b border-dashed border-divider-secondary">
															P-Expire
														</p>
													}
													showArrow={true}
												/>
												<PriceExpiredWrapper
													pExpired={insurance.p_liquidation}
													symbol={`${insurance.asset}USDT`}
												/>
											</div>
											<div className="flex items-center justify-between text-body-12">
												<TooltipCustom
													content={<p className="text-xs">Claim amount</p>}
													title={
														<p className="text-typo-secondary text-xs border-b border-dashed border-divider-secondary">
															Claim amount
														</p>
													}
													showArrow={true}
												/>
												<QClaimWrapper
													qClaim={insurance.q_claim}
													margin={insurance.margin}
													unit={insurance.unit}
												/>
											</div>
											<div className="flex items-center justify-between text-body-12">
												<TooltipCustom
													content={<p className="text-xs">Margin</p>}
													title={
														<p className="text-typo-secondary text-xs border-b border-dashed border-divider-secondary">
															Margin
														</p>
													}
													showArrow={true}
												/>
												<p>{formatNumber(insurance.margin)}</p>
											</div>
											<div className="flex items-center justify-between text-body-12">
												<TooltipCustom
													content={<p className="text-xs">Insured Value</p>}
													title={
														<p className="text-typo-secondary text-xs border-b border-dashed border-divider-secondary">
															Insured Value
														</p>
													}
													showArrow={true}
												/>
												<p>{formatNumber(insurance.q_covered)}</p>
											</div>
										</section>
									}>
									<section className="flex items-center justify-between w-full">
										<div className="text-body-12 flex items-center gap-2">
											<Image
												src={insurance.token.attachment}
												width={24}
												height={24}
												alt="token"
											/>
											<div className="flex items-center gap-1">
												<span className="text-typo-primary">
													{insurance.asset}
												</span>
												<span className="text-typo-secondary">/ USDT</span>
											</div>
										</div>
										<div
											className={cn(
												"!text-body-12 text-typo-primary px-3 flex justify-center items-center rounded-sm h-[18px]",
												insurance.side === ENUM_INSURANCE_SIDE.BULL
													? "bg-positive-label"
													: "bg-negative-label"
											)}>
											{insurance.side}
										</div>
									</section>
								</CoinListWrapper>
							);
						})
					) : (
						<div className="w-full py-10 text-center my-auto text-typo-secondary border border-divider-secondary rounded-md">
							<EmptyData />
						</div>
					)}

					<Pagination
						pageIndex={currentPage - 1}
						setPageIndex={(page) => setPagination(page + 1)}
						onPreviousPage={() => setPagination(currentPage - 1)}
						onNextPage={() => setPagination(currentPage + 1)}
						canNextPage={currentPage < Math.ceil(totalInsurances / 10)}
						canPreviousPage={currentPage > 1}
						pageCount={Math.ceil(totalInsurances / 10)}
						className="mt-4"
					/>

				</section>
			)}
		</div>
	);
};
export default ContractList;
