import React from "react";
import dayjs from "dayjs";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/common/Calendar/DateRangPicker";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { FilterIcon } from "lucide-react";
import { getTransactionsList, ParamsTransaction } from "@/apis/referral.api";
import { LIMIT_PAGE } from "../constant";
import Button from "@/components/common/Button";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import useWalletStore from "@/stores/wallet.store";
import dynamic from "next/dynamic";
import Spinner from "@/components/common/Spinner";
import FilterTransactionHistory from "../drawer/FilterTransactionHistory";
import Tag from "@/components/common/Tag";
import { capitalize } from "@/utils/helper";
import { formatNumber } from "@/utils/format";
import Pagination from "@/components/common/Pagination";
import {
	SelectGroup,
	SelectContent,
	SelectTrigger,
	Select,
	SelectItem,
} from "@/components/common/Dropdown/Base";
import EmptyData from "@/components/common/EmptyData";
const STATUS: {
	[x: string]: "primary" | "error" | "warning" | "disabled" | "success";
} = {
	MARGIN: "primary",
	CLAIM: "success",
	REFUND: "warning",
	CANCEL: "error",
	WITHDRAW: "success",
};

const HistoryTable = dynamic(() => import("./HistoryTable"), {
	ssr: false,
	loading: () => (
		<div className="w-full flex items-center justify-center mt-4">
			<Spinner size="large" />
		</div>
	),
});
const TransactionHistory: React.FC = () => {
	const [wallet] = useWalletStore((state) => [state.wallet]);
	const [filter, setFilter] = React.useState<any>(undefined);
	const [date, setDate] = React.useState<DateRange>({
		from: undefined,
		to: undefined,
	});
	const isMobile = useIsMobile();
	const [coin, setCoin] = React.useState<any>(undefined);
	const [data, setData] = React.useState<{ rows: any[]; total: number }>({
		rows: [],
		total: 0,
	});
	const [page, setPage] = React.useState<number>(1);
	const optionsSelect = React.useMemo(() => {
		return [
			{
				label: "All",
				value: "all",
			},
			{
				label: "USDT",
				value: "USDT",
				iconUrl: "/assets/images/cryptos/usdt.png",
			},
			// {
			// 	label: "VNST",
			// 	value: "VNST",
			// 	iconUrl: "/assets/images/cryptos/vnst.png",
			// },
		];
	}, []);
	const handleSelect = (range: DateRange | undefined) => {
		if (range) {
			setDate(range);
		}
	};
	const optionsStatus = [
		{
			label: "All",
			value: "all",
		},
		{
			label: "Margin",
			value: "MARGIN",
		},
		{
			label: "Claim",
			value: "CLAIM",
		},
		{
			label: "Refund",
			value: "REFUND",
		},
		{
			label: "Cancel",
			value: "CANCEL",
		},
		{
			label: "Withdraw",
			value: "WITHDRAW",
		},
	];
	const params = React.useMemo(() => {
		let paramsConvert: ParamsTransaction = {
			page: page,
			limit: LIMIT_PAGE,
		};
		if (filter !== "all" && filter !== undefined) {
			paramsConvert = {
				...paramsConvert,
				type: filter as ParamsTransaction["type"],
				page: 1,
			};
		}
		// if (coin !== "all" || coin !== undefined) {
		// 	paramsConvert = {
		// 		...paramsConvert,
		// 		unit: coin as ParamsTransaction["unit"],
		// 	};
		// }
		if (date?.from) {
			paramsConvert = {
				...paramsConvert,
				from: dayjs(date.from).startOf("day").toDate(),
				to: dayjs(date.to).endOf("day").toDate(),
				page: 1,
			};
		}
		return paramsConvert;
	}, [filter, date, page]);

	React.useEffect(() => {
		const handleGetTransactions = async () => {
			try {
				const res = await getTransactionsList(params);
				if (res) {
					setData(res);
				}
			} catch (err) {
				console.log(err);
			}
		};
		handleGetTransactions();
	}, [params, wallet]);
	return (
		<div>
			<div className="flex items-center w-full justify-between lg:border-b lg:border-divider-secondary lg:pb-4">
				{isMobile ? (
					<FilterTransactionHistory
						optionsStatus={optionsStatus}
						optionSymbol={optionsSelect}
						status={filter}
						symbol={coin}
						handleChangeStatus={(status) => setFilter(status)}
						handleChangeSymbol={(symbol) => setCoin(symbol)}
						handleChangeDate={handleSelect}
						date={date}
					/>
				) : (
					<div className="flex w-max items-center gap-x-3">
						<Select
							onValueChange={(value: any) => {
								setFilter(value);
							}}
							value={filter}>
							<SelectTrigger
								className={"min-w-[84px] hover:!border-typo-accent hover:bg-background-secondary"}
								size={"lg"}
								border>
								<span className="text-xs">
									{optionsStatus.find((item) => item.value === filter)?.label ||
										"Status"}
								</span>
							</SelectTrigger>
							<SelectContent className="">
								<SelectGroup>
									{optionsStatus.map((item, index) => {
										return (
											<SelectItem
												key={item.label + index}
												value={item.value}
												size={"lg"}>
												{item.label || ""}
											</SelectItem>
										);
									})}
								</SelectGroup>
							</SelectContent>
						</Select>
						{/* <Select
							onValueChange={(value: any) => {
								setCoin(value);
							}}
							value={coin}
						>
							<SelectTrigger className={"min-w-[84px]"} size={"lg"} border>
								<span className="text-xs">
									{optionsSelect.find((item) => item.value === coin)?.label ||
										"Unit"}
								</span>
							</SelectTrigger>
							<SelectContent className="">
								<SelectGroup>
									{optionsSelect.map((item, index) => {
										return (
											<SelectItem
												key={item.label + index}
												value={item.value}
												size={"lg"}
											>
												{item.label || ""}
											</SelectItem>
										);
									})}
								</SelectGroup>
							</SelectContent>
						</Select> */}
						<div className="flex items-center justify-between gap-1 border text-typo-secondary border-divider-secondary max-h-[40px] px-2 py-2 rounded-md text-sm min-w-[220px] hover:bg-background-secondary hover:border-background-primary">
							<DateRangePicker
								range={date}
								onChange={handleSelect}
								labelClassName=""
								className="w-full">
								<div className="w-full flex items-center justify-between py-0.5">
									{date.from !== undefined ? (
										<Button
											onClick={() =>
												setDate({ from: undefined, to: undefined })
											}
											className="flex items-center justify-between gap-x-1 text-sm"
											size="md">
											<p>
												{dayjs(date.from).format("DD/MM/YYYY")} -
												{dayjs(date.to).format("DD/MM/YYYY")}
											</p>
											{date?.from ? "x" : null}
										</Button>
									) : (
										<p className="text-sm">Select time</p>
									)}
									<CalendarIcon className="size-4" color="currentColor"/>
								</div>
							</DateRangePicker>
						</div>
					</div>
				)}
			</div>
			{isMobile ? (
				<div className="flex flex-col gap-y-3 mt-5">
					{data.rows?.length > 0 ? (
						data.rows?.map((item) => (
							<div
								key={item?.id}
								className="p-3 border border-divider-secondary">
								<div className="flex items-center justify-between w-full pb-3 border-b border-divider-secondary">
									<p className="text-xs">Transaction type</p>
									<Tag
										variant={STATUS[item?.type as keyof typeof STATUS]}
										text={capitalize(item?.type)}
									/>
								</div>
								<div className="pt-3">
									<div className="flex items-center w-full justify-between">
										<p className="text-typo-secondary text-xs">Time</p>
										<p className="text-xs">
											{dayjs(item?.createdAt).format("DD/MM/YYYY HH:mm")}
										</p>
									</div>
									<div className="flex items-center w-full justify-between">
										<p className="text-typo-secondary text-xs">
											Trading volume
										</p>
										<div className="flex items-center gap-x-1 text-xs">
											{formatNumber(item.amount, 2)}
											<img
												src={`/assets/images/cryptos/${item?.unit.toLowerCase()}.png`}
												className="size-5"
												alt="token"
											/>
										</div>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="w-full py-10 text-center my-auto text-typo-secondary border border-divider-secondary rounded-md mt-5">
							<EmptyData />
						</div>
					)}
					<Pagination
						onPreviousPage={() => setPage(page - 1)}
						canPreviousPage={page > 1}
						onNextPage={() => {
							setPage(page + 1);
						}}
						pageIndex={page - 1}
						pageCount={Math.ceil(data.total / LIMIT_PAGE)}
						canNextPage={page < Math.ceil(data.total / LIMIT_PAGE)}
						setPageIndex={(currentPage) => setPage(currentPage + 1)}
						limit={1}
					/>
				</div>
			) : (
				<div className="">
					<HistoryTable data={data} page={page} setPage={setPage} />
				</div>
			)}
		</div>
	);
};

export default TransactionHistory;
