import React, { useRef } from "react";
import { DateRange } from "react-day-picker";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { TParamsGetFriendList, getFriendList } from "@/apis/referral.api";
import dynamic from "next/dynamic";
import { SortingState } from "@tanstack/react-table";
import useReferralStore from "@/stores/referral.store";
import useWalletStore from "@/stores/wallet.store";
import dayjs from "dayjs";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import { DateRangePicker } from "@/components/common/Calendar/DateRangPicker";
import Input from "@/components/common/Input";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import Button from "@/components/common/Button";
import CloseIcon from "@/components/common/Icons/CloseIcon";
import Spinner from "@/components/common/Spinner";
import FilterFriendList from "../drawer/FilterFriendList";
import FriendMobileItem from "./FriendMobileItem";
import { TFriends } from "../type";
import ModalEditDescription from "../modal/ModalEditDescription";
import ModalInfoFriend from "../modal/ModalInfoFriend";
import { useNotification } from "@/components/common/Notification";
import {
	SelectGroup,
	SelectContent,
	SelectTrigger,
	Select,
	SelectItem,
} from "@/components/common/Dropdown/Base";
import Pagination from "@/components/common/Pagination";
import EmptyData from "@/components/common/EmptyData";

const FriendTable = dynamic(() => import("./FriendTable"), {
	ssr: false,
	loading: () => (
		<div className="w-full mt-5 flex items-center justify-center">
			<Spinner size="large" />
		</div>
	),
});

const FriendListTab: React.FC = () => {
	const [filter, setFilter] = React.useState<string>("all");
	const [date, setDate] = React.useState<DateRange>({
		from: undefined,
		to: undefined,
	});
	const [page, setPage] = React.useState(1);
	const isMobile = useIsMobile();
	const [search, setSearch] = React.useState<string>("");
	const [friendList, setFriendList] = React.useState<{
		rows: TFriends[];
		total: number;
	}>({ rows: [], total: 0 });
	const inputRef = useRef(null);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const toast = useNotification();
	const [
		isOpenModalEdit,
		setOpenModalEditDescription,
		friendInfo,
		openModalFriend,
		setOpenWalletFriend,
	] = useReferralStore((state) => [
		state.openModalEditInfo,
		state.setOpenModalEditInfo,
		state.infoFriend,
		state.openWalletFriend,
		state.setOpenWalletFriend,
	]);
	const wallet = useWalletStore((state) => state.wallet);
	const optionsFriendKind = React.useMemo(() => {
		if (wallet?.isPartner && wallet?.isPartner === true) {
			return [
				{
					label: "All",
					value: "all",
				},
				{
					label: "F1",
					value: "F1",
				},
				{
					label: "F2",
					value: "F2",
				},
				{
					label: "F3",
					value: "F3",
				},
				{
					label: "F4",
					value: "F4",
				},
			];
		} else return [];
	}, [wallet]);
	const handleSelect = (range: DateRange | undefined) => {
		if (range) {
			setDate(range);
		} else {
		}
	};
	const handleSearch = (e: any) => {
		setSearch(e.target.value);
	};
	React.useEffect(() => {
		let params: TParamsGetFriendList = {
			page: page,
			limit: 10,
		};
		if (sorting.length > 0) {
			params = {
				...params,
				sort: sorting[0].desc === true ? "-" + sorting[0].id : sorting[0].id,
				page:1
			};
		}
		if (date.from && date.to) {
			params = {
				...params,
				invitedAtFrom: dayjs(date.from).startOf("day").toDate(),
				invitedAtTo: dayjs(date.to).endOf("day").toDate(),
				page:1
			};
		}
		if (filter !== "all") {
			params = {
				...params,
				type: filter,
				page:1
			};
		}
		if (search) {
			params = {
				...params,
				q: search,
				page:1
			};
		}
		const fetchData = async () => {
			const res = await getFriendList(params);
			if (res) {
				setFriendList(res);
			}
		};
		fetchData();
	}, [date, sorting, search, filter, wallet, isOpenModalEdit , page]);

	return (
		<div className="">
			<div className="mt-4 flex items-center justify-between lg:border-b lg:border-divider-secondary pb-4">
				{isMobile ? (
					<FilterFriendList
						searchTX={search}
						onChangeSearchTX={handleSearch}
						date={date}
						handleChangeDate={handleSelect}
					/>
				) : (
					<div className="flex items-center gap-x-3">
						{wallet?.isPartner && wallet?.isPartner === true ? (
							<Select
								onValueChange={(value: any) => {
									setFilter(value);
								}}
								value={filter}
							>
								<SelectTrigger className={"max-w-[84px]"} size={"lg"} border>
									<span className="text-xs">
										{optionsFriendKind.find((item) => item.value === filter)
											?.label || "Select date"}
									</span>
								</SelectTrigger>
								<SelectContent className="">
									<SelectGroup>
										{optionsFriendKind.map((item, index) => {
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
							</Select>
						) : null}
						<div className="flex items-center justify-between gap-1 border text-typo-secondary border-divider-secondary bg-light-2 px-2 py-1.5 rounded-md text-sm min-w-[220px] lg:h-10 hover:bg-background-secondary hover:text-typo-accent hover:border-background-primary">
							<DateRangePicker
								onChange={handleSelect}
								labelClassName=""
								range={date}
								className="w-full h-full"
							>
								<div className="flex items-center justify-between w-full py-0.5">
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
									<CalendarIcon className="size-4" color="currentColor" />
								</div>
							</DateRangePicker>
						</div>
						<Input
							prefix={<SearchIcon className="w-4 h-4" />}
							onChange={handleSearch}
							ref={inputRef}
							value={search}
							wrapperClassInput="bg-transparent !border rounded-md hover:border-background-primary !text-sm border-divider-secondary h-10"
							suffixClassName="!border-l-0"
							size="md"
							placeholder="Search friend address"
							className="!text-sm"
						/>
					</div>
				)}
			</div>

			{isMobile ? (
				<div className="flex flex-col gap-y-5">
					{friendList?.total > 0 ? (
						friendList?.rows?.map((item) => (
							<FriendMobileItem data={item as TFriends} key={item.id} />
						))
					) : (
						<div className="w-full py-10 text-center my-auto text-typo-secondary border border-divider-secondary rounded-md">
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
						pageCount={Math.ceil(friendList.total / 10)}
						canNextPage={page < Math.ceil(friendList.total / 10)}
						setPageIndex={(currentPage) => setPage(currentPage + 1)}
						limit={1}
					/>
				</div>
			) : (
				<FriendTable
					page={page}
					setPage={setPage}
					sorting={sorting}
					setSorting={setSorting}
					data={friendList}
				/>
			)}
			{isMobile && (
				<ModalInfoFriend
					open={openModalFriend}
					handleClose={() => setOpenWalletFriend(false, {})}
				/>
			)}
			<ModalEditDescription
				isOpen={isOpenModalEdit}
				onRequestClose={() => setOpenModalEditDescription(false, friendInfo)}
				defaultNote={friendInfo?.note}
			/>
		</div>
	);
};

export default FriendListTab;
