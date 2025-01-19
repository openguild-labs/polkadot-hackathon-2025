import { MarketPair } from "@/@type/pair.type";
import Button from "@/components/common/Button";
import {
	FavoriteFillIcon,
	FavoriteOutlineIcon,
} from "@/components/common/Icons/FavoriteIcon";
import useAppStore from "@/stores/app.store";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/format";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo, useState } from "react";
import TableCustom from "./TableCustom";
import { useWallet } from "@suiet/wallet-kit";

type Props = {
	dataTable: { rows: MarketPair[]; total: number };
	type: "hot" | "favorite";
	handleFavorite?: (symbol: string, isFavorite?: boolean) => void;
	symbolFavorites?: { [x: string]: boolean };
	listCategories: { label: string; value: number }[];
};

export default function TableFavoriteHot({
	dataTable,
	type,
	handleFavorite,
	symbolFavorites,
	listCategories,
}: Props) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const { account } = useWallet();
	const { toggleConnectWalletModal } = useAppStore();

	const showData = useMemo(() => {
		if (sorting.length > 0) {
			let dataSort: any[] = [...dataTable.rows];
			const sort = sorting[0];
			const sortKey = sort.id;
			const sortValue = sort.desc;
			dataSort = dataSort.sort((a, b) => {
				if (sortKey === "totalBullBear") {
					const valueA = a.totalBull + a.totalBear;
					const valueB = b.totalBull + b.totalBear;
					return sortValue ? valueB - valueA : valueA - valueB;
				}
				const valueA = a[sortKey];
				const valueB = b[sortKey];

				if (typeof valueA === "number" && typeof valueB === "number") {
					return sortValue ? valueB - valueA : valueA - valueB;
				} else {
					const stringA = String(valueA).toLowerCase();
					const stringB = String(valueB).toLowerCase();
					return sortValue
						? stringB.localeCompare(stringA)
						: stringA.localeCompare(stringB);
				}
			});
			return dataSort;
		}
		return [...dataTable.rows];
	}, [sorting, dataTable]);

	const columns: ColumnDef<MarketPair>[] = useMemo(
		() => {
			const column: ColumnDef<MarketPair>[] = [
				{
					accessorKey: "asset",
					header: () => <span className="text-xs text-typo-primary">Pair</span>,
					cell: (props) => {
						return (
							<div className="flex items-center gap-x-2">
								<img
									src={props.row.original.token?.attachment}
									alt="Token Icon"
									className="w-5 h-5 rounded-full"
								/>
								<span className="text-xs text-typo-primary">
									{props.row.original.asset}
								</span>
								{props.row.original.isHot && (
									<div className="font-saira text-typo-primary text-xs font-medium bg-negative-label py-0.5 px-1 rounded-sm">
										Hot
									</div>
								)}
							</div>
						);
					},
					meta: {
						width: 100,
						showArrow: true,
					},
				},

				{
					accessorKey: "lastPrice",
					header: () => (
						<span className="text-xs text-typo-primary">Market Price</span>
					),
					cell: (props) => {
						return (
							<div className="text-xs text-typo-primary">{`$${formatNumber(
								props.row.getValue("lastPrice")
							)}`}</div>
						);
					},
					meta: {
						showArrow: true,
					},
				},
				{
					accessorKey: "priceChangePercent",
					header: () => (
						<span className="text-xs text-typo-primary">24h Change</span>
					),
					cell: (props) => {
						const gap = props.row.original.priceChangePercent;
						return (
							<div
								className={cn("text-xs", {
									" text-negative-label": gap < 0,
									" text-positive": gap >= 0,
								})}>
								{gap >= 0 ? "+" : "-"}
								{formatNumber(Math.abs(gap), 2)}%
							</div>
						);
					},
					meta: {
						showArrow: true,
					},
				},
				{
					accessorKey: "high",
					header: () => (
						<span className="text-xs text-typo-primary">24h High</span>
					),
					cell: (props) => {
						return (
							<div className="text-xs text-typo-primary">{`$${formatNumber(
								props.row.original.high
							)}`}</div>
						);
					},
					meta: {
						showArrow: true,
					},
				},
				{
					accessorKey: "low",
					header: () => (
						<span className="text-xs text-typo-primary">24h Low</span>
					),
					cell: (props) => {
						return (
							<div className="text-xs text-typo-primary">{`$${formatNumber(
								props.row.original.low
							)}`}</div>
						);
					},
					meta: {
						showArrow: true,
					},
				},
				{
					accessorKey: "q_covered",
					header: () => (
						<span className="text-xs text-typo-primary">Insured Value</span>
					),
					cell: (props) => {
						return (
							<div className="text-xs text-typo-primary">{`${formatNumber(
								props.row.original.q_covered
							)}`}</div>
						);
					},
					meta: {
						showArrow: true,
					},
				},

				{
					accessorKey: "margin",
					header: () => (
						<span className="text-xs text-typo-primary">Total Margin</span>
					),
					cell: (props) => {
						return (
							<div className="text-xs text-typo-primary">{`$${formatNumber(
								props.row.original.margin
							)}`}</div>
						);
					},
					meta: {
						showArrow: true,
					},
				},
				{
					accessorKey: "action",
					header: "",
					cell: (props) => (
						<div className="w-full flex items-center justify-end">
							<Button variant="primary" size="md">
								<Link href={`/buy-cover/${props.row.original.symbol}`}>
									Buy cover
								</Link>
							</Button>
						</div>
					),
				},
			];
			if (type === "favorite") {
				column.unshift({
					accessorKey: "favorite",
					header: () => null,
					cell: (props) => (
						<div
							// className="text-body-12B"
							onClick={() => {
								handleFavorite &&
									handleFavorite(props.row.original.symbol, true);
							}}>
							<FavoriteFillIcon className="lg:size-6 size-5" />
						</div>
					),
				});
			} else {
				column.unshift({
					accessorKey: "hot",
					header: () => null,
					cell: (props) => {
						const isFavorite =
							symbolFavorites &&
							symbolFavorites[props.row.original.symbol] === true;
						return (
							<div
								// className="text-body-12B"
								onClick={() => {
									if (account?.address) {
										handleFavorite &&
											handleFavorite(props.row.original.symbol, isFavorite);
									} else {
										toggleConnectWalletModal(true);
									}
								}}>
								{isFavorite ? (
									<FavoriteFillIcon className="lg:size-6 size-5" />
								) : (
									<FavoriteOutlineIcon className="lg:size-6 size-5" />
								)}
							</div>
						);
					},
				});
			}
			return column;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[symbolFavorites, listCategories, showData]
	);
	if (type === "favorite") {
		columns.splice(2, 0, {
			accessorKey: "category",
			header: () => <span className="text-xs text-typo-primary">Category</span>,
			cell: (props) => {
				const categories = props.row.original.token.tagIds.map((tagId) => {
					const category = listCategories?.find(
						(category) => category.value === tagId
					);
					return category?.label;
				});
				return (
					<div className="text-typo-accent text-xs">
						{categories.join(", ")}
					</div>
				);
			},
			meta: {
				width: 246,
			},
		});
	}
	if (type === "hot") {
		columns.splice(7, 0, {
			accessorKey: "totalBullBear",
			header: () => (
				<span className="text-xs text-typo-primary">Bull / Bear</span>
			),
			cell: (props) => {
				const { totalBull, totalBear } = props.row.original;
				return (
					<div className="text-typo-primary text-xs">
						{totalBull}/{totalBear}
					</div>
				);
			},
			meta: {
				width: 120,
				showArrow: true,
			},
		});
	}
	return (
		<TableCustom
			columns={columns}
			data={showData}
			sorting={sorting}
			setSorting={setSorting}
			total={dataTable.total}
		/>
	);
}
