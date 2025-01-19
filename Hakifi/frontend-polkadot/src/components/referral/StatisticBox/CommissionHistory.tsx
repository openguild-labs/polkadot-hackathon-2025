import React, { useState, useRef } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
import { capitalize, substring } from "@/utils/helper";
import { formatNumber } from "@/utils/format";
import { DateRange } from "react-day-picker";
import { useIsMobile } from "@/hooks/useMediaQuery";
import DataTable from "@/components/common/DataTable";
import { getFriendHistoryList } from "@/apis/referral.api";
import { CHAIN_SCAN } from "@/utils/constant";
import Input from "@/components/common/Input";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import { DateRangePicker } from "@/components/common/Calendar/DateRangPicker";
import Button from "@/components/common/Button";
import CloseIcon from "@/components/common/Icons/CloseIcon";
import FilterCommissionHistory from "../drawer/FilterCommissionHistory";
import Tag from "@/components/common/Tag";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import CommissionHistoryItem from "./CommissionHistoryItem";
import { TCommission } from "../type";
import dayjs from "dayjs";
import { COMMISSION_TYPE, floorNumber } from "../constant";
import Pagination from "@/components/common/Pagination";
import EmptyData from "@/components/common/EmptyData";
import useWalletStore from "@/stores/wallet.store";

const CommissionHistory: React.FC = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [date, setDate] = React.useState<DateRange>({
		from: undefined,
		to: undefined,
	});
	const wallet = useWalletStore((state) => state.wallet);
	const [search, setSearch] = React.useState<string>("");
	const [data, setData] = React.useState<{
		rows: TCommission[];
		total: number;
	}>({ rows: [], total: 0 });
	const [page, setPage] = React.useState<number>(1);
	const paramsGetListFriend: any = React.useMemo(() => {
		let params: any = {
			page,
			limit: 10,
		};
		if (sorting.length > 0) {
			params = {
				...params,
				sort: sorting[0].desc === true ? "-" + sorting[0].id : sorting[0].id,
				page: 1,
			};
		}
		if (date.from && date.to) {
			params = {
				...params,
				createdFrom: dayjs(date.from).startOf("day").toDate(),
				createdTo: dayjs(date.to).endOf("day").toDate(),
				page:1
			};
		}
		if (search) {
			params = {
				...params,
				q: search,
			};
		}
		return params;
	}, [date, sorting, search, page]);

	React.useEffect(() => {
		const handleGetListContractFriend = async () => {
			try {
				const res = await getFriendHistoryList(paramsGetListFriend);
				if (res) {
					setData(res);
				}
			} catch (err) {
				console.log(err);
			}
		};
		handleGetListContractFriend();
	}, [date, sorting, search, page, paramsGetListFriend, wallet]);
	const handleChangePage = (page: number) => {
		setPage(page);
	};
	const columns: ColumnDef<TCommission>[] = useMemo(
		() => [
			{
				accessorKey: "walletAddress",
				header: "Address",
				cell: ({ row }) => {
					return (
						<div
							onClick={() =>
								window.open(
									`${CHAIN_SCAN}/tx/${row.original?.fromUser?.walletAddress}`,
									"_blank"
								)
							}
						>
							<Link
								href={
									`${CHAIN_SCAN}/tx/${row.original?.fromUser?.walletAddress}` ||
									""
								}
								className="flex items-center gap-x-1 text-xs text-typo-primary"
								target="_blank"
							>
								{substring(row.original?.fromUser?.walletAddress || "")}
								{/* <ExternalIcon /> */}
							</Link>
						</div>
					);
				},
				aggregate: "link",
			},
			{
				accessorKey: "symbol",
				header: "Pair",
				cell: ({ row }) => {
					return (
						<p className="text-xs">
							<span className="text-typo-primary ">
								{row.original.insurance.asset}
							</span>
							<span>/{row.original.insurance.unit}</span>
						</p>
					);
				},
			},
			{
				accessorKey: "side",
				header: "Side",
				cell: ({ row }) => {
					const { side } = row.original.insurance;
					return (
						<Tag variant={side === "BULL" ? "success" : "error"} text={side} />
					);
				},
			},
			{
				accessorKey: "type",
				header: "Type",
				cell: ({ row }) => {
					return (
						<div className="text-sm text-typo-primary">
							F{row.original?.type || 0}
						</div>
					);
				},
			},
			{
				accessorKey: "commissionType",
				header: "Commission type",
				cell: ({ row }) => {
					return (
						<div className="text-sm text-typo-primary">
							{COMMISSION_TYPE[row.original?.commissionType]}
						</div>
					);
				},
				meta: {
					showArrow: true,
				},
			},
			{
				accessorKey: "margin",
				header: "Margin ",
				cell: ({ row }) => {
					return (
						<div className="flex items-center gap-x-1 text-sm text-typo-primary">
							<img
								src="/assets/images/cryptos/usdt.png"
								className="h-6 w-6"
								alt="usdt"
							/>
							{formatNumber(row.original.insurance.margin, 2)}
						</div>
					);
				},
			},
			{
				accessorKey: "amount",
				header: "Commission",
				cell: ({ row }) => {
					return (
						<div className="flex items-center gap-x-1 text-sm text-typo-primary">
							<img
								src="/assets/images/cryptos/usdt.png"
								className="h-6 w-6"
								alt="usdt"
							/>
							{floorNumber(row.original.amount)}
						</div>
					);
				},
			},
			{
				accessorKey: "createdAt",
				header: "Close time",
				cell: ({ row }) => {
					return (
						<div className="text-typo-primary">
							{dayjs(row.original.insurance.closedAt).format(
								"DD/MM/YYYY - HH:mm:ss"
							)}
						</div>
					);
				},
				meta: {
					showArrow: true,
				},
				aggregate: "link",
			},
		],
		[]
	);
	const handleSelect = (range: DateRange | undefined) => {
		if (range) {
			setDate(range);
		} else {
		}
	};
	const handleSearch = (e: any) => {
		setSearch(e.target.value);
	};
	const inputRef = useRef(null);
	const isMobile = useIsMobile();
	return (
		<div className="my-5">
			<div className="flex items-center justify-between lg:border-b lg:border-divider-secondary pb-4">
				{isMobile ? (
					<FilterCommissionHistory
						searchTX={search}
						date={date}
						handleChangeDate={handleSelect}
						onChangeSearchTX={handleSearch}
					/>
				) : (
					<div className="flex items-center gap-x-3">
						<div className="flex items-center gap-1 justify-between rounded-md text-typo-secondary border max-h-10 border-divider-secondary bg-transparent px-2 text-sm min-w-[220px] py-1.5 hover:bg-background-secondary hover:border-background-primary">
							<DateRangePicker
								range={date}
								onChange={handleSelect}
								labelClassName=""
								className="w-full h-full"
							>
								<div className="w-full flex items-center justify-between py-2 ">
									{date?.from ? (
										<Button
											onClick={() =>
												setDate({ from: undefined, to: undefined })
											}
											className="flex items-center justify-center gap-x-1 text-xs"
											size="md"
										>
											<p>
												{dayjs(date.from).format("DD/MM/YYYY")} -
												{dayjs(date.to).format("DD/MM/YYYY")}
											</p>
											{date?.from ? <CloseIcon width={16} height={16} /> : null}
										</Button>
									) : (
										<p>Select time</p>
									)}
									<CalendarIcon className="w-4 h-4" color="currentColor"/>
								</div>
							</DateRangePicker>
						</div>
						<Input
							prefix={<SearchIcon className="w-4 h-4" />}
							onChange={handleSearch}
							ref={inputRef}
							placeholder="Search friend address"
							value={search}
							wrapperClassInput="bg-transparent outline-none text-typo-secondary border border-divider-secondary rounded-md text-sm !px-2 h-10  hover:border-background-primary"
							prefixClassName="!border-l-0"
							size="lg"
							className="text-sm"
							classFocus="border-background-primary"
						/>
					</div>
				)}
			</div>
			{isMobile ? (
				<div>
					{data?.rows?.length > 0 ? (
						data.rows?.map((item: TCommission) => (
							<CommissionHistoryItem data={item} key={item.id} />
						))
					) : (
						<div className="w-full py-10 text-center my-auto text-typo-secondary border border-divider-secondary rounded-md">
							<EmptyData />
						</div>
					)}
					<Pagination
						pageIndex={page - 1}
						setPageIndex={(page) => setPage(page + 1)}
						onPreviousPage={() => setPage(page - 1)}
						onNextPage={() => setPage(page + 1)}
						canNextPage={page - 1 < Math.ceil(data.total / 10)}
						canPreviousPage={page > 1}
						pageCount={Math.ceil(data?.total / 10)}
					/>
				</div>
			) : (
				<DataTable
					columns={columns}
					data={data?.rows}
					showPagination={false}
					total={data?.total}
					setSorting={setSorting}
					sorting={sorting}
					onChangePagination={handleChangePage}
				/>
			)}
		</div>
	);
};

export default CommissionHistory;
