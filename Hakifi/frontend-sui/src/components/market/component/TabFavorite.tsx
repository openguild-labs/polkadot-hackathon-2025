import { MarketPair } from "@/@type/pair.type";
import { deletePairFavorites, getPairFavorites } from "@/apis/pair.api";
import NoConnectWallet from "@/components/common/NoConnectWallet";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useEffect, useMemo, useState } from "react";
import CoinListFavoriteHot from "./CoinListFavoriteHot";
import TableFavoriteHot from "./TableFavoriteHot";
import EmptyData from "@/components/common/EmptyData";
import { useWallet } from "@suiet/wallet-kit";

type TProps = {
	filter: {
		categories: number[];
		sort: string;
		sortType: string;
		search: string;
	};
	listCategories: { label: string; value: number }[];
};

const TabFavorite = ({ filter, listCategories }: TProps) => {
	const isMobile = useIsMobile();
	const { connected } = useWallet();
	const [data, setData] = useState<{ rows: MarketPair[]; total: number }>();
	const fetchData = async () => {
		const params = {
			limit: 99,
			page: 1,
			includePrice: true,
		};
		try {
			await getPairFavorites(params).then((res: any) => {
				setData(res);
			});
		} catch (error) {}
	};

	const handleDeleteFavorites = async (symbol: string) => {
		try {
			await deletePairFavorites(symbol);
			setData((prevData) => ({
				rows: prevData?.rows.filter((item) => item.symbol !== symbol) || [],
				total: prevData?.total ? prevData.total - 1 : 0,
			}));
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		if (connected) {
			fetchData();
		}
	}, [connected]);
	const listFavorite = useMemo(() => {
		const isFilter =
			Object.values(filter).filter((item) => item !== undefined).length > 0;
		let dataFilter = data?.rows;
		if (isFilter) {
			if (filter.categories.length > 0) {
				dataFilter = dataFilter?.filter((item) =>
					filter.categories.some((categoryId) =>
						item.token.tagIds.includes(categoryId)
					)
				);
			}
			if (filter?.search.length > 0) {
				dataFilter = dataFilter?.filter((item) =>
					item.asset.toLowerCase().includes(filter.search.toLowerCase())
				);
			}
			if (filter.sortType) {
				if (filter.sort === "asset") {
					dataFilter?.sort((a, b) => {
						const sortValueA = String(a[filter.sort as keyof MarketPair]);
						const sortValueB = String(b[filter.sort as keyof MarketPair]);
						if (filter.sortType === "asc") {
							return sortValueA.localeCompare(sortValueB);
						} else if (filter.sortType === "desc") {
							return sortValueB.localeCompare(sortValueA);
						}

						return 0;
					});
				} else {
					dataFilter?.sort((a, b) => {
						const sortValueA = Number(a[filter.sort as keyof MarketPair]);
						const sortValueB = Number(b[filter.sort as keyof MarketPair]);
						if (filter.sortType === "asc") {
							return sortValueA - sortValueB;
						} else if (filter.sortType === "desc") {
							return sortValueB - sortValueA;
						}
						return 0;
					});
				}
			}
		}

		return dataFilter;
	}, [data, filter]);
	const { show, Component } = useMemo(() => {
		if (data?.rows.length === 0) {
			return {
				show: true,
				Component: () => (
					<div className="flex flex-col items-center">
						<img
							src="/assets/images/icons/noData_icon.png"
							className="w-20 h-20 lg:w-[124px] lg:h-[124px]"
							alt="No Data"
						/>
						<p className="text-sm lg:text-base font-medium font-saira text-typo-secondary text-center">
							You haven't added any cryptocurrency pairs yet. <br /> Start now
							by adding popular trading pairs to your favorites.
						</p>
					</div>
				),
			};
		} else if (listFavorite?.length === 0) {
			return {
				show: true,
				Component: () => <EmptyData />,
			};
		} else
			return {
				show: false,
				Component: () => <></>,
			};
	}, [data, listFavorite]);
	if (!connected) return <NoConnectWallet />;
	if (show) return <Component />;
	
	return (
		<>
			{isMobile && !show ? (
				<CoinListFavoriteHot
					listToken={{
						rows: listFavorite || [],
						total: listFavorite?.length || 0,
					}}
					type="favorite"
					handleFavorite={handleDeleteFavorites}
					listCategories={listCategories}
				/>
			) : (
				<TableFavoriteHot
					dataTable={{
						rows: listFavorite || [],
						total: listFavorite?.length || 0,
					}}
					type="favorite"
					handleFavorite={handleDeleteFavorites}
					listCategories={listCategories}
				/>
			)}
		</>
	);
};

export default TabFavorite;
