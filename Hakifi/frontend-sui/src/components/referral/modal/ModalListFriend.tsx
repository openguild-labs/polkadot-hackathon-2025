import { substring } from "@/utils/helper";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import React from "react";
import Modal from "@/components/common/Modal";
import { getFriendListInRefCode } from "@/apis/referral.api";
import DataTable from "@/components/common/DataTable";
interface ModalListFriendProps {
	open: boolean;
	handleClose: any;
	infoCode: any;
}

const ModalListFriend: React.FC<ModalListFriendProps> = ({
	open,
	handleClose,
	infoCode,
}) => {
	const [data, setData] = React.useState<{
		total: number;
		rows: {
			invitedAt: string;
			id: string;
			note: string;
			walletAddress: string;
		}[];
	}>({ total: 0, rows: [] });
	const handleGetListFriend = async () => {
		try {
			const res = await getFriendListInRefCode(infoCode.code);
			if (res) {
				setData(res);
			}
		} catch (err) {
			console.log(err);
		}
	};
	React.useEffect(() => {
		if (open === true) {
			handleGetListFriend();
		}
	}, [infoCode, open]);
	const columns: ColumnDef<any>[] = React.useMemo(
		() => [
			{
				accessorKey: "walletAddress",
				header: () => {
					return <div className="text-xs">Address</div>;
				},
				cell: ({ row }) => {
					return (
						<div>
							<p className="text-sm text-typo-accent">
								{" "}
								{substring(row.original.walletAddress)}
							</p>
							<p className="max-w-[172px] truncate text-sm text-typo-secondary">
								{row.original.note}
							</p>
						</div>
					);
				},
				aggregate: "link",
			},
			{
				accessorKey: "invitedAt",
				header: () => {
					return (
						<div className="w-full text-end text-xs">Referred time</div>
					);
				},
				cell: ({ row }) => {
					return (
						<div className="w-full text-end text-sm text-typo-primary">
							{dayjs(row.original.invitedAt).format("DD/MM/YYYY - HH:mm:ss")}
						</div>
					);
				},
				aggregate: "link",
			},
		],
		[data]
	);
	return (
		<Modal
			isOpen={open}
			onRequestClose={handleClose}
			title={<div className="text-typo-primary text-start">Friend list</div>}
			modal={true}
			useDrawer={false}
		>
			<div className="rounded-md p-3 bg-support-black border border-divider-secondary">
				<DataTable
					columns={columns}
					data={data.rows}
					total={data.total}
					styleHeader="!bg-support-black !border-none"
					styleBody="!pb-4 border-b border-divider-secondary"
					classNameWrapper="bg-support-black"
				/>
			</div>
		</Modal>
	);
};

export default ModalListFriend;
