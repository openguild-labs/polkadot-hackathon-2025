import { Wallet } from "@/@type/wallet.type";
import { Avatar, AvatarImage } from "@/components/common/Avatar";
import Copy from "@/components/common/Copy";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
} from "@/components/common/Dropdown/Base";
import PencilIcon from "@/components/common/Icons/PencilIcon";
import Tag from "@/components/common/Tag";
import useBalance from "@/hooks/useBalance";
import useWalletStore from "@/stores/wallet.store";
import { formatNumber } from "@/utils/format";
import { substring } from "@/utils/helper";
import { USDT_MOON_ADDRESS } from "@/web3/constants";
import React, { useState } from "react";
import ModalAddReferralCode from "../modal/ModalAddReferralCode";

const assets = [
	{
		value: USDT_MOON_ADDRESS,
		iconUrl: "/assets/images/cryptos/usdt.png",
		label: "USDT",
		assetImage: "https://tether.to/images/logoMarkGreen.svg",
	},
	// {
	// 	className: "text-vnst",
	// 	value: undefined,
	// 	iconUrl: "/assets/images/cryptos/bnb.png",
	// 	label: "SUI",
	// },
];

type TProps = {
	handleOpenModalEdit: () => void;
};

const InfoUser = ({ handleOpenModalEdit }: TProps) => {
	const [contractAddress, setContractAddress] = React.useState<any>(
		assets[0].label
	);
	const [solBalance, setsolBalance] = useState(0);
	// const { data } = useBalance({
	// 	address: address as Address,
	// 	token: contractAddress as Address,
	// });

	// const { error, loading, balance } = useAccountBalance();
	// const { connection } = useConnection();

	const { balance: usdtBalance } = useBalance();
	// const getBalanceSUI = useMemo(() => {
	// 	if (balance) return Number(balance) / 10 ** 9;
	// 	return 0;
	// }, [balance]);

	// useEffect(() => {
	// 	getBalanceSol();
	// }, [publicKey]);

	const wallet = useWalletStore((state) => state.wallet) as Wallet;

	const [openModalAddRefCode, setModalAddRefCode] = React.useState(false);
	return (
		<div className="flex flex-col gap-y-5">
			<div className="border-b border-divider-secondary ">
				<div className="flex items-center px-5 justify-between w-full">
					<div className=" py-4 flex items-center gap-x-2">
						<Avatar className="text-center !w-6 !h-6">
							<AvatarImage src="/assets/images/avatar.png" alt="Avatar" />
						</Avatar>
						<Copy
							text={wallet?.walletAddress}
							prefix={
								<p className="text-typo-primary">
									{substring(wallet?.walletAddress || "")}
								</p>
							}
						/>
					</div>
					{wallet?.isPartner === true && (
						<Tag text="Partner" variant="primary" />
					)}
				</div>
			</div>
			<div className="px-5">
				<div className="w-full rounded-md border border-divider-secondary bg-support-black p-3 flex items-center">
					<div className="flex w-full h-full flex-col gap-y-1 items-start justify-start">
						<p className="text-xs text-typo-secondary">Balances</p>
						<div>
							<p className="flex items-center justify-start gap-x-1 text-base text-typo-primary">
								{contractAddress === "USDT"
									? formatNumber(usdtBalance, 2)
									: ''}
								{/* : formatNumber(getBalanceSUI, 4)} */}
								<span>{contractAddress}</span>
							</p>
						</div>
					</div>
					<Select
						onValueChange={(value: any) => {
							setContractAddress(value);
						}}
						value={contractAddress}>
						<SelectTrigger className={"max-w-[64px]"} size={"md"} border>
							<span className="text-xs">{contractAddress || "Select asset"}</span>
						</SelectTrigger>
						<SelectContent className="max-w-[64px]" side="bottom">
							<SelectGroup>
								{assets.map((item, index) => {
									return (
										<SelectItem
											key={item.label + index}
											value={item?.label as unknown as string}
											size={"md"}>
											<p>{item.label}</p>
										</SelectItem>
									);
								})}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="rounded-md bg-light-2 lg:px-4 px-5 flex flex-col gap-y-3">
				<div className="flex items-center justify-between">
					<p className="lg:text-sm text-xs text-typo-secondary">Username</p>
					<button
						className="text-sm text-typo-primary flex items-center gap-x-1"
						onClick={handleOpenModalEdit}>
						{wallet?.username || "----"} <PencilIcon className="size-6" />
					</button>
				</div>
				<div className="flex items-center justify-between">
					<p className="lg:text-sm text-xs text-typo-secondary">Email</p>
					<button
						className="text-sm text-typo-primary flex items-center gap-x-1"
						onClick={handleOpenModalEdit}>
						{wallet?.email || "----"} <PencilIcon className="size-6" />
					</button>
				</div>
			</div>
			<div>
				<div className="grid grid-cols-2 items-center gap-x-2 justify-between px-5 pt-1 ">
					<div className="h-full flex items-center col-span-1 flex-col gap-y-1 justify-between border border-divider-secondary py-2 px-3 rounded-md max-h-[58px]">
						<p className="text-xs text-typo-secondary">Commission</p>
						<p className="text-sm text-typo-primary">
							Level {wallet?.level || 1}
						</p>
					</div>
					<div className="h-full flex items-center col-span-1 flex-col gap-y-1 justify-between border border-divider-secondary py-2 px-3 rounded-md max-h-[58px]">
						<p className="text-xs text-typo-secondary">Referral code</p>
						{wallet?.refCode ? (
							<p className="text-sm text-typo-primary">{wallet?.refCode}</p>
						) : (
							<button
								onClick={() => {
									setModalAddRefCode(true);
								}}
								className="text-sm px-2 py-0.5 text-typo-primary hover:text-typo-accent">
								Add code
							</button>
						)}
					</div>
				</div>
			</div>
			<ModalAddReferralCode
				open={openModalAddRefCode}
				onClose={() => setModalAddRefCode(false)}
			/>
		</div>
	);
};
export default InfoUser;
