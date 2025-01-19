import Button from "@/components/common/Button";
import ExternalIcon from "@/components/common/Icons/ExternalIcon";
import { Separator } from "@/components/common/Separator";
import dayjs from "dayjs";
import { TFriends } from "../type";
import { substring } from "@/utils/helper";
import PencilIcon from "@/components/common/Icons/PencilIcon";
import useReferralStore from "@/stores/referral.store";
import { floorNumber } from "../constant";

type TProps = {
	data: TFriends;
};

const FriendMobileItem = ({ data }: TProps) => {
	const [setOpenModalEditDescription, setOpenWalletFriend] = useReferralStore(
		(state) => [state.setOpenModalEditInfo, state.setOpenWalletFriend]
	);
	return (
		<section className="flex flex-col border border-divider-secondary p-3 rounded">
			<section className="flex items-center justify-between">
				<p className="text-xs text-typo-primary">Address</p>
				<Button
					className="flex items-center gap-1"
					size="md"
					onClick={() => setOpenWalletFriend(true, data)}
				>
					<span className="text-typo-primary">
						{substring(data.walletAddress)}
					</span>
					<ExternalIcon />
				</Button>
			</section>
			<Separator className="my-3" />
			<section className="flex flex-col gap-3">
				<div className="flex items-center justify-between text-body-12">
					<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
						Invited time
					</p>
					<p className="text-typo-primary">
						{dayjs(data.invitedAt).format("DD/MM/YYYY - hh:mm:ss")}
					</p>
				</div>
				<div className="flex items-center justify-between text-body-12">
					<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
						Type
					</p>
					<div className="flex items-center gap-1">
						<div className="text-typo-primary">F{data?.type || 0}</div>
					</div>
				</div>
				<div className="flex items-center justify-between text-body-12">
					<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
						Level
					</p>

					<p className="text-typo-primary">{data.level}</p>
				</div>
				<div className="flex items-center justify-between text-body-12">
					<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
						Friends
					</p>

					<p className="text-typo-primary">{data.totalFriends}</p>
				</div>
				<div className="flex items-center justify-between text-body-12">
					<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
						Commission
					</p>

					<p className="text-typo-primary">
						{floorNumber(data.totalCommission || 0)}
					</p>
				</div>
				<div className="flex items-center justify-between text-body-12 w-full">
					<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
						Note
					</p>

					<div className="text-typo-primary flex items-center justify-end w-full gap-x-1">
						<p className="max-w-[60%] truncate">{data.note || "----"}</p>
						<Button
							size="md"
							onClick={() => setOpenModalEditDescription(true, data)}
						>
							<PencilIcon />
						</Button>
					</div>
				</div>
			</section>
		</section>
	);
};

export default FriendMobileItem;
