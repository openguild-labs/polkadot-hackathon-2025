/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import dayjs from "dayjs";
import useReferralStore from "@/stores/referral.store";
import ModalEditDescription from "../modal/ModalEditDescription";
import DataTable from "@/components/common/DataTable";
import { substring } from "@/utils/helper";
import PencilIcon from "@/components/common/Icons/PencilIcon";
import ModalInfoFriend from "../modal/ModalInfoFriend";
import { TFriends } from "../type";
import { floorNumber } from "../constant";

type TProps = {
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	data: any;
};

const FriendTable: React.FC<TProps> = ({
	page,
	setPage,
	sorting,
	setSorting,
	data,
}) => {
	const [
		setOpenModalEditInfo,
		openModalEditInfo,
		friendInfo,
		setOpenWalletFriend,
		openModalFriend,
	] = useReferralStore((store) => [
		store.setOpenModalEditInfo,
		store.openModalEditInfo,
		store.infoFriend,
		store.setOpenWalletFriend,
		store.openWalletFriend,
	]);

	const columns: ColumnDef<TFriends>[] = useMemo(
		() => [
			{
				accessorKey: "walletAddress",
				header: "Address",
				cell: ({ row }) => {
					return (
						<button
							className="flex items-center gap-x-1 text-xs text-typo-primary !py-0.5"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setOpenWalletFriend(true, row.original);
							}}
						>
							{substring(row.original.walletAddress)}
						</button>
					);
				},
				aggregate: "link",
				meta: {
					onCellClick: (data: any) => {
						setOpenWalletFriend(true, data);
					},
				},
			},
			{
				accessorKey: "createdAt",
				header: "Referred time",
				cell: ({ row }) => {
					return (
						<div className="text-typo-primary text-xs !py-0.5">
							{dayjs(row.original.invitedAt)
								.tz("Asia/Ho_Chi_Minh")
								.format("DD/MM/YYYY - HH:mm:ss")}
						</div>
					);
				},
				meta: {
					showArrow: true,
				},
				aggregate: "link",
			},
			{
				accessorKey: "type",
				header: "Type",
				cell: ({ row }) => {
					return (
						<div className="text-typo-primary !py-0.5">
							F{row.original.type || 0}
						</div>
					);
				},
			},
			{
				accessorKey: "level",
				header: "Level",
				cell: ({ row }) => {
					return (
						<div className="text-typo-primary text-xs !py-0.5">
							{row.original.level || 1}
						</div>
					);
				},
			},
			{
				accessorKey: "totalFriends",
				header: "Friends",
				cell: ({ row }) => {
					return (
						<div className="text-typo-primary text-xs !py-0.5">
							{`${row.original.totalFriends} people`}
						</div>
					);
				},
				meta: {
					showArrow: true,
				},
			},
			{
				accessorKey: "totalCommission",
				header: "Commission",
				cell: ({ row }) => {
					return (
						<div className="flex items-center gap-x-1 text-xs text-typo-primary !py-0.5">
							<img
								src="/assets/images/cryptos/usdt.png"
								className="h-6 w-6"
								alt="usdt"
							/>
							{floorNumber(row.original.totalCommission || 0)}
						</div>
					);
				},
			},
			{
				accessorKey: "description",
				header: "Note",
				cell: ({ row }) => {
					return (
						<div className="flex max-w-[120px] items-center gap-x-1 text-xs text-typo-primary !py-0.5">
							<p className="w-4/5 truncate">{row.original.note || "----"}</p>{" "}
							<button
								onClick={(e) => {
									e.stopPropagation();
									e.preventDefault();
									setOpenModalEditInfo(true, row.original);
								}}
							>
								<PencilIcon />
							</button>
						</div>
					);
				},
				meta: {
					width: 120,
					onCellClick: (data: any) => {
						setOpenModalEditInfo(true, data);
					},
				},
			},
		],
		[data]
	);
	return (
		<>
			<DataTable
				columns={columns}
				data={data.rows || []}
				total={data.total || 0}
				setSorting={setSorting}
				sorting={sorting}
				onChangePagination={(page) => setPage(page)}
			/>
			<ModalEditDescription
				isOpen={openModalEditInfo}
				onRequestClose={() => setOpenModalEditInfo(false, friendInfo)}
				defaultNote={friendInfo?.note}
			/>
			<ModalInfoFriend
				open={openModalFriend}
				handleClose={() => setOpenWalletFriend(false, undefined)}
			/>
		</>
	);
};

export default FriendTable;
