import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import dayjs from "dayjs";
import ExternalIcon from "../../common/Icons/ExternalIcon";
import { Transaction } from "../type";
import DataTable from "@/components/common/DataTable";
import { formatNumber } from "@/utils/format";
import Tag from "@/components/common/Tag";
import { scanUrl } from "@/utils/helper";

type TransactionType = Transaction["type"];

const typeStatus: {
	[K in TransactionType]: {
		label: string;
		variant: "primary" | "error" | "warning" | "disabled" | "success";
	};
} = {
	MARGIN: {
		label: "Margin",
		variant: "primary",
	},
	CLAIM: {
		label: "Claim",
		variant: "success",
	},
	REFUND: {
		label: "Refund",
		variant: "warning",
	},
	CANCEL: {
		label: "Cancel",
		variant: "error",
	},
	WITHDRAW: {
		label: "Withdraw",
		variant: "success",
	}
};

type TProps = {
	data: {
		rows: Transaction[];
		total: number;
	};
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
};

const HistoryTable = ({ data, setPage, page }: TProps) => {
	const columns: ColumnDef<Transaction>[] = useMemo(
		() => [
			{
				accessorKey: "type",
				header: ({ column }) => {
					return <div className="text-xs">Transaction type</div>;
				},
				cell: ({ row }) => {
					const { variant, label } = typeStatus[row.original.type];
					return (
						<div className="text-typo-primary">
							<Tag text={label} variant={variant} />
						</div>
					);
				},
			},
			{
				accessorKey: "time",
				header: () => <div className="text-xs">Time</div>,
				cell: ({ row }) => {
					return (
						<div
							onClick={() =>
								window.open(
									scanUrl(row.original.txhash),
									"_blank"
								)
							}
						>
							<a
								className="flex items-center gap-x-1 text-typo-primary"
								href={scanUrl(row.original.txhash)}
								target="_blank"
								rel="noopener noreferrer"
							>
								{dayjs(row.original.time).format("DD/MM/YYYY - HH:mm:ss")}
								<ExternalIcon />
							</a>
						</div>
					);
				},
			},
			{
				accessorKey: "token",
				header: () => <div className="text-xs">Amount</div>,
				cell: ({ row }) => {
					const unitName = row.original.unit.toLowerCase();
					return (
						<div className="flex items-center justify-start gap-x-1 text-typo-primary">
							<img
								src={`/assets/images/cryptos/${unitName}.png`}
								className="size-5"
								alt="token"
							/>
							{formatNumber(row.original.amount, 2)}
						</div>
					);
				},
			},
		],
		[]
	);
	return (
		<DataTable
			columns={columns}
			data={data.rows}
			total={data.total}
			onChangePagination={(value) => setPage(value)}
		/>
	);
};

export default HistoryTable;
