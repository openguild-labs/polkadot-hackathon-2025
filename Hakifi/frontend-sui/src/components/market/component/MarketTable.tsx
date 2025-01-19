"use client";

import { MarketPair } from "@/@type/pair.type";
import { getAllCategory } from "@/apis/pair.api";
import FormInput from "@/components/common/FormInput";
import HotIcon from "@/components/common/Icons/HotIcon";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import { useNotification } from "@/components/common/Notification";
import SelectSearch from "@/components/common/Select/SelectSearch";
import TableTabs from "@/components/common/TableTabs";
import { useIsMobile } from "@/hooks/useMediaQuery";
import useMarketStore from "@/stores/market.store";
import { cn } from "@/utils";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import CoinListPolicy from "./CoinListPolicy";
import ConnectWalletMarket from "./ConnectWalletMarket";
import DrawerFilterMarket from "./Drawer/DrawerFilterMarket";
import TabFavorite from "./TabFavorite";
import TabHot from "./TabHot";
import TablePolicy from "./TablePolicy";
import CloseIcon from "@/components/common/Icons/CloseIcon";
import { useWallet } from "@suiet/wallet-kit";

type TKeys = "favorite" | "hot" | "policy";
type TFilter = Record<
	TKeys,
	{ categories: number[]; sort: string; sortType: string; search: string; }
>;
type TSort = Record<
	TKeys,
	{ label: string; value: keyof MarketPair; } | undefined
>;
type TCategories = Record<TKeys, any[] | undefined>;

export default function MarketTable() {
	const isMobile = useIsMobile();
	const { connected } = useWallet();
	const [tabs] = useMarketStore((state) => [state.tabs]);
	const [openModal, setOpenModal] = useState(false);
	const [openModalCategory, setOpenModalCategory] = useState(false);
	const [openModalSort, setOpenModalSort] = useState(false);
	const [categories, setCategories] = useState<TCategories>({
		favorite: undefined,
		hot: undefined,
		policy: undefined,
	});
	const [listCategories, setListCategories] = useState<
		{ label: string; value: number; }[]
	>([]);
	const [openSortType, setOpenSortType] = useState(false);
	const [search, setSearch] = useState<string>("");
	const [sort, setSort] = useState<TSort>({
		favorite: undefined,
		hot: undefined,
		policy: undefined,
	});
	const [sortType, setSortType] = useState<TSort>({
		favorite: undefined,
		hot: undefined,
		policy: undefined,
	});
	const [filter, setFilter] = useState<TFilter>({
		favorite: {
			categories: [],
			sort: "",
			sortType: "",
			search: "",
		},
		hot: {
			categories: [],
			sort: "",
			sortType: "",
			search: "",
		},
		policy: {
			categories: [],
			sort: "",
			sortType: "",
			search: "",
		},
	});
	const toast = useNotification();
	const handleChooseCategories = (category: any) => {
		const isCategoryExist = categories[tabs]?.some(
			(item) => item.value === category.value
		);

		if (isCategoryExist) {
			const updatedList = categories[tabs]?.filter(
				(item) => item.value !== category.value
			);
			setCategories({ ...categories, [tabs]: updatedList });
		} else {
			const newList = [...(categories[tabs] || []), category];
			setCategories({ ...categories, [tabs]: newList });
		}
	};
	const handleChooseSort = (sortItem: any) => {
		setOpenModalSort(false);
		if (sort[tabs] && sort[tabs]?.value === sortItem.value) {
			setSort({ ...sort, [tabs]: undefined });
		} else {
			setSort({ ...sort, [tabs]: sortItem });
		}
	};
	const handleChooseSortType = (sortTypeItem: any) => {
		setOpenSortType(false);
		if (sortType[tabs] && sortType[tabs]?.value === sortTypeItem.value) {
			setSortType({ ...sortType, [tabs]: undefined });
		} else {
			setSortType({ ...sortType, [tabs]: sortTypeItem });
		}
	};
	const handleResetFilter = () => {
		setSort({ favorite: undefined, hot: undefined, policy: undefined });
		setCategories({ favorite: undefined, hot: undefined, policy: undefined });
		setSortType({
			favorite: undefined,
			hot: undefined,
			policy: undefined,
		});
	};
	const handleConfirm = () => {
		if (sortType !== undefined) {
			setFilter({
				...filter,
				[tabs]: {
					categories: categories[tabs]?.map((item) => item.value) ?? [],
					sort: sort[tabs]?.value || "",
					sortType: sortType[tabs]?.value,
					search,
				},
			});
			setOpenModal(false);
		} else {
			toast.error("Please choose sort type");
		}
	};
	const debouncedHandleSearch = debounce((value) => {
		setFilter((prevFilter: TFilter) => {
			const updatedFilter: TFilter = {
				favorite: { ...prevFilter.favorite, search: value },
				hot: { ...prevFilter.hot, search: value },
				policy: { ...prevFilter.policy, search: value },
			};
			return updatedFilter;
		});
	}, 300);
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		debouncedHandleSearch(e.target.value);
	};

	useEffect(() => {
		const handleGetListCategories = async () => {
			try {
				const res = await getAllCategory();
				if (res) {
					setListCategories(
						[{ label: "All", value: 0 }].concat(
							res.map((item) => ({ value: item.id, label: item.name }))
						)
					);
				}
			} catch (err) {
				console.log(err);
			}
		};
		handleGetListCategories();
	}, [search]);
	return (
		<section className="mt-6 mb-[60px] lg:my-10">
			<div
				className={cn(
					"border border-solid border-divider-secondary p-4 rounded-md space-y-2",
					{ "bg-background-tertiary": !!connected }
				)}>
				<TableTabs
					filterTable={
						<div className="h-full flex gap-x-3 w-full lg:justify-start items-center">
							<FormInput
								size={"md"}
								placeholder="Search token"
								prefix={<SearchIcon className="h-4 w-4" />}
								wrapperClassName="text-sm flex-1 lg:flex-none  lg:w-max w-full !rounded-sm"
								onChange={handleSearch}
								value={search}
								wrapperClassInput=" w-full text-typo-secondary !rounded-sm h-max "
								className="lg:text-sm"
								classFocus="border-background-primary"
								suffix={
									search.length > 0 ? (
										<button
											onClick={() => {
												setSearch("");
												debouncedHandleSearch("");
											}}>
											<CloseIcon className="w-3 h-3" />
										</button>
									) : undefined
								}
							/>
							<SelectSearch
								options={listCategories}
								value={listCategories
									.filter((item) =>
										filter[tabs].categories.includes(item.value)
									)
									.map((item) => item.label)}
								onChange={(value: string) => {
									if (Number(value) === 0) {
										setFilter({
											...filter,
											[tabs]: {
												...filter[tabs],
												categories: [],
											},
										});
									} else if (
										filter[tabs].categories.some(
											(item) => item === Number(value)
										)
									) {
										const updatedCategories = filter[tabs].categories.filter(
											(item) => item !== Number(value)
										);
										setFilter({
											...filter,
											[tabs]: {
												...filter[tabs],
												categories: updatedCategories,
											},
										});
									} else
										setFilter({
											...filter,
											[tabs]: {
												...filter[tabs],
												categories: [...filter[tabs].categories, value],
											},
										});
								}}
								className="min-w-[240px] lg:flex hidden text-xs lg:text-sm text-typo-secondary"
								isMultiple={true}
								placeholder="Select categories"
								size="md"
							/>

							{isMobile && (
								<div className="h-8 w-8 flex items-center justify-center border border-solid border-divider-secondary rounded-sm">
									<DrawerFilterMarket
										isOpen={openModal}
										handleClose={() => setOpenModal(false)}
										handleOpenCategory={() => setOpenModalCategory(true)}
										handleOpenSort={() => setOpenModalSort(true)}
										sort={sort[tabs]}
										categories={categories[tabs] ?? []}
										openCategory={openModalCategory}
										handleCloseCategories={() => setOpenModalCategory(false)}
										handleChooseCategories={handleChooseCategories}
										openSort={openModalSort}
										handleCloseSort={() => setOpenModalSort(false)}
										handleChooseSort={handleChooseSort}
										openSortType={openSortType}
										sortType={sortType[tabs]}
										handleOpenSortType={() => setOpenSortType(true)}
										handleCloseSortType={() => setOpenSortType(false)}
										handleChooseSortType={handleChooseSortType}
										handleOpen={() => setOpenModal(true)}
										handleResetFilter={handleResetFilter}
										handleConfirm={handleConfirm}
										dataCategories={listCategories}
									/>
								</div>
							)}
						</div>
					}
					listTab={[
						{ value: "favorite", title: "FAVORITE" },
						{
							value: "hot",
							title: "All cryptos",
							prefix: <HotIcon className="w-6 h-6" />,
						},
						// { value: "policy", title: "POLICY" },
					]}
					listContent={[
						{
							value: "favorite",
							children:
								connected ? (
									//   isMobile ? (
									//     <CoinListFavoriteHot listCoin={dataSample} />
									//   ) : (
									//     <TableFavoriteHot />
									//   )
									<TabFavorite
										filter={filter[tabs]}
										listCategories={listCategories || []}
									/>
								) : (
									<ConnectWalletMarket />
								),
						},
						{
							value: "hot",
							children: (
								<TabHot
									filter={filter[tabs]}
									listCategories={listCategories || []}
								/>
							),
						},
						{
							value: "policy",
							children:
								connected ? (
									isMobile ? (
										<CoinListPolicy listCoin={[]} />
									) : (
										<TablePolicy />
									)
								) : (
									<ConnectWalletMarket />
								),
						},
					]}
				/>
			</div>
		</section>
	);
}
