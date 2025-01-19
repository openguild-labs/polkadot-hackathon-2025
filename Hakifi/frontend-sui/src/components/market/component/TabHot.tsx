import { MarketPair } from "@/@type/pair.type";
import {
	addPairFavorites,
	deletePairFavorites,
	getAllFavoritesSymbol,
	getAllMarketPair,
} from "@/apis/pair.api";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useCallback, useEffect, useMemo, useState } from "react";
import CoinListFavoriteHot from "./CoinListFavoriteHot";
import TableFavoriteHot from "./TableFavoriteHot";
import EmptyData from "@/components/common/EmptyData";
import Spinner from "@/components/common/Spinner";
import { useWallet } from "@suiet/wallet-kit";

type TProps = {
	filter: {
		categories: number[];
		sort: string;
		sortType: string;
		search: string;
	};
	listCategories: { label: string; value: number; }[];
};

export default function TabHot({ filter, listCategories }: TProps) {
	const isMobile = useIsMobile();
	const { account } = useWallet();
	const [data, setData] = useState<MarketPair[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [symbolFavorites, setSymbolFavorites] = useState<{
		[x: string]: boolean;
	}>({});
	const handleFavorite = useCallback(
		async (symbol: string, isFavorite?: boolean) => {
			if (!account?.address) return;
			const updatedSymbolFavorites = { ...symbolFavorites };
			if (isFavorite) {
				delete updatedSymbolFavorites[symbol];
			} else {
				updatedSymbolFavorites[symbol] = true;
			}
			setSymbolFavorites(updatedSymbolFavorites);
			try {
				if (isFavorite) {
					await deletePairFavorites(symbol);
				} else {
					await addPairFavorites(symbol);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		},
		[symbolFavorites, account]
	);
	useEffect(() => {
		const getListFavorites = async () => {
			try {
				const res = await getAllFavoritesSymbol();
				if (res) {
					const parseData = res.reduce(
						(obj: { [x: string]: boolean; }, item) => {
							obj[item] = true;
							return obj;
						},
						{}
					);
					setSymbolFavorites(parseData);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		if (account?.address) {
			getListFavorites();
		}
		const getMarketPairs = async () => {
			try {
				const res = await getAllMarketPair();
				setIsLoading(true);
				if (res) {
					setData(res);
					setIsLoading(false);
				}
			} catch (err) {
				console.error(err);
			}
		};
		getMarketPairs();
	}, [account]);
	const listToken = useMemo(() => {
		const isFilter =
			Object.values(filter).filter((item) => item !== undefined).length > 0;

		let dataFilter = data.sort((a, b) => {
			if (a.totalContract === b.totalContract) {
				return b.margin - a.margin;
			};
			return b.totalContract - a.totalContract;
		});

		if (isFilter) {
			if (filter?.search.length > 0) {
				dataFilter = dataFilter?.filter((item) =>
					item.asset.toLowerCase().includes(filter.search.toLowerCase())
				);
			}
			if (filter.categories.length > 0) {
				dataFilter = dataFilter?.filter((item) =>
					filter.categories.some((categoryId) =>
						item.token.tagIds.includes(categoryId)
					)
				);
			}
			if (filter.sortType) {
				if (filter?.sort === "totalBullBear") {
					dataFilter?.sort((a, b) => {
						const aBullBear = a.totalBull + a.totalBear;
						const bBullBear = b.totalBull + b.totalBear;
						if (filter.sortType === "asc") {
							return Number(aBullBear) - Number(bBullBear);
						} else if (filter.sortType === "desc") {
							return Number(bBullBear) - Number(aBullBear);
						}
						return 0;
					});
				}
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
	if (isLoading === true) return <div>
		<div className="flex w-full items-center pt-10 justify-center">
			<Spinner
				className="w-20 h-20"
				size="xs"
			/>
		</div>
	</div>;
	if (listToken?.length === 0 && isLoading === false) return <EmptyData />;
	return (
		<>
			{isMobile ? (
				<CoinListFavoriteHot
					listToken={{ rows: listToken || [], total: listToken?.length || 0 }}
					symbolFavorites={symbolFavorites}
					type="hot"
					handleFavorite={handleFavorite}
					listCategories={listCategories}
				/>
			) : (
				<TableFavoriteHot
					dataTable={{ rows: listToken || [], total: listToken?.length || 0 }}
					type="hot"
					handleFavorite={handleFavorite}
					symbolFavorites={symbolFavorites}
					listCategories={listCategories}
				/>
			)}
		</>
	);
}
