import { Separator } from "@/components/common/Separator";
import { cn } from "@/utils";
import { capitalize, substring } from "@/utils/helper";
import dayjs from "dayjs";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";
import Image from "next/image";
import { TCommission } from "../type";
import { COMMISSION_TYPE, floorNumber } from "../constant";

const CommissionHistoryItem = ({ data }: { data: TCommission }) => {
	return (
		<section className="flex flex-col border border-divider-secondary p-3 rounded">
			<section className="flex items-center justify-between">
				<div className="text-body-12 flex items-center gap-2">
					<Image
						src={data.insurance.token.attachment}
						width={24}
						height={24}
						alt="token"
					/>
					<div className="flex items-center gap-1">
						<span className="text-typo-primary">{data.insurance.asset}</span>
						<span className="text-typo-secondary">/ {data.insurance.unit}</span>
					</div>
				</div>
				<div
					className={cn(
						"!text-body-12 text-typo-primary py-2 px-3 text-center rounded-sm",
						data.insurance.side === ENUM_INSURANCE_SIDE.BULL
							? "bg-positive-label"
							: "bg-negative-label"
					)}
				>
					{data.insurance.side}
				</div>
			</section>
			<Separator className="my-3" />
			<section className="flex flex-col gap-3">
				<div className="flex items-center justify-between text-body-12">
					<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
						Address
					</p>
					<p className="text-typo-primary">
						{substring(data.fromUser.walletAddress)}
					</p>
				</div>
				<div className="flex items-center justify-between text-body-12">
					<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
						Type
					</p>
					<p className="text-typo-primary">F{data?.toUserLevel}</p>
				</div>
				<div className="flex items-center justify-between text-body-12">
					<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
						Commission type
					</p>
					<p className="text-typo-primary">
						{COMMISSION_TYPE[data?.commissionType]}
					</p>
				</div>
				<div className="flex items-center justify-between text-body-12">
					<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
						Margin
					</p>
					<p className="text-typo-primary flex items-center gap-x-1 w-max">
						{data.insurance.margin}{" "}
						<Image
							src={`/assets/images/cryptos/${data.insurance.unit.toLowerCase()}.png`}
							width={24}
							height={24}
							alt={""}
						/>
					</p>
				</div>
				<div className="flex items-center justify-between text-body-12">
					<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
						Commission
					</p>
					<p className="text-typo-primary flex items-center gap-x-1 w-max">
						{floorNumber(data.amount || 0)}{" "}
						<Image
							src={`/assets/images/cryptos/${data.insurance.unit.toLowerCase()}.png`}
							width={24}
							height={24}
							alt="token"
						/>
					</p>
				</div>
				<div className="flex items-center justify-between text-body-12">
					<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
						Close time
					</p>
					<p className="text-typo-primary">
						{dayjs(data.insurance.closedAt).format("DD/MM/YYYY - hh:mm:ss")}{" "}
					</p>
				</div>
			</section>
		</section>
	);
};

export default CommissionHistoryItem;
