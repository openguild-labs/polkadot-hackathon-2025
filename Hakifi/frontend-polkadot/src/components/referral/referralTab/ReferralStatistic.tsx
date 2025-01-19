import React, { useEffect, useMemo, useRef, useState } from "react";
import ModalWithdraw from "../modal/ModalWithDraw";
import { getWalletStatistic } from "@/apis/referral.api";
import { floorNumber } from "../constant";
import ModalSuccess from "@/components/common/Modal/ModalSuccess";
import ModalError from "@/components/common/Modal/ModalError";
import ModalLoadingWithDraw from "../modal/ModalLoadingWithDraw";
import Button from "@/components/common/Button";
import { WalletStatistic } from "../type";
import useWalletStore from "@/stores/wallet.store";
import TooltipCustom from "@/components/common/Tooltip";
import { formatNumber } from "@/utils/format";

const ReferralStatistic: React.FC = () => {
	const [openWithDraw, setOpenWithDraw] = React.useState<boolean>(false);
	const [data, setData] = useState<Partial<WalletStatistic>>({});
	const [openModalLoading, setOpenModalLoading] = React.useState(false);
	const [openModalSuccess, setOpenModalSuccess] = React.useState(false);
	const [openModalError, setOpenModalError] = React.useState(false);
	const [error, setError] = useState<string>("");
	const preReward = useRef<number>(0)
	const onMounted = useRef<boolean>(false)
	const wallet = useWalletStore((state) => state.wallet);
	useEffect(() => {
		const handleGetCommissionStats = async () => {
			try {
				const res = await getWalletStatistic("USDT").then(
					(response) => response
				);
				if (res) {
					console.log(res)
					setData(res);
					if(!onMounted.current) {

						preReward.current = res.balance - res.locked

						onMounted.current = true
					}
				}
			} catch (err) {
				return err;
			}
		};
		handleGetCommissionStats();
	}, [openModalSuccess, openModalError, wallet]);
	const availableAmount = useMemo(() => {
		console.log(data)
		const amount = Number(data?.balance || 0) - Number(data?.locked || 0);
		if (amount < 0) return 0;
		return amount;
	}, [data]);
	return (
		<div className="my-5">
			<div className="flex w-full items-center justify-between">
				<p className="lg:text-base text-sm text-typo-primary">Statistics</p>
			</div>
			<div className="mt-5 flex w-full flex-col gap-y-3">
				<div className="flex items-center justify-between w-full shadow-md">
					<p className="lg:text-sm text-xs text-typo-secondary">
						Total commission
					</p>
					<p className="flex items-center gap-x-1 lg:text-sm text-xs text-typo-primary">
						{formatNumber(data.totalCommission || 0, 4)}
						<img
							src="/assets/images/cryptos/usdt.png"
							className="w-4 h-4"
							alt="logo"
						/>
					</p>
				</div>
				<div className="flex items-center justify-between shadow-md">
					<p className="lg:text-sm text-xs text-typo-secondary">Withdrawn</p>
					<p className="flex items-center gap-x-1 lg:text-sm text-xs text-typo-primary">
						{formatNumber(
							Number(data?.totalCommission) - Number(data.balance) || 0
						, 4)}
						<img
							src="/assets/images/cryptos/usdt.png"
							className="w-4 h-4"
							alt="logo"
						/>
					</p>
				</div>
				<div className="flex items-center w-full justify-between">
					<p className="lg:text-sm text-xs text-typo-secondary">Available</p>
					<p className="flex items-center gap-x-1 lg:text-sm text-xs text-typo-primary">
						{formatNumber(availableAmount || 0, 4)}
						<img
							src="/assets/images/cryptos/usdt.png"
							className="w-4 h-4"
							alt="logo"
						/>
					</p>
				</div>
				{availableAmount < 10 ? (
					<TooltipCustom
						title={
							<Button
								size="lg"
								variant="primary"
								className="px-4 py-2 !text-center w-full !flex !items-center mt-2  !rounded-[2px]"
								disabled={true}>
								<p className="w-full text-center text-typo-disable">Withdraw</p>
							</Button>
						}
						content="Minimum to withdraw is 10 USDT."
						contentClassName="w-full"
					/>
				) : (
					<Button
						size="lg"
						variant="primary"
						className="px-4 py-2 !text-center w-full !flex !items-center mt-2 !rounded-[2px]"
						onClick={() => setOpenWithDraw(true)}>
						<p className="w-full text-center">Withdraw</p>
					</Button>
				)}
			</div>
			<ModalWithdraw
				open={openWithDraw}
				onClose={() => setOpenWithDraw(false)}
				availableCommission={availableAmount || 0}
				handleCloseModalLoading={() => setOpenModalLoading(false)}
				handleOpenModalError={() => setOpenModalError(true)}
				handleOpenModalSuccess={() => setOpenModalSuccess(true)}
				handleOpenModalLoading={() => setOpenModalLoading(true)}
				setError={setError}
			/>
			<ModalSuccess
				open={openModalSuccess}
				handleClose={() => setOpenModalSuccess(false)}
				successMessage={
					<div className="flex flex-col gap-y-5 text-center items-center">
						<p className="text-2xl">Commission withdrew successfully</p>
						<p className="text-typo-secondary">
							You have successfully withdrawn your reward
							<span className="text-typo-primary ml-1">
								{formatNumber(preReward.current)} USDT
							</span>
						</p>
						{/* <Button
							size="lg"
							variant="primary"
							className="px-4 py-2 !text-center w-full !flex !items-center"
							onClick={() => setOpenWithDraw(true)}
						>
							<p className="w-full text-center">Try again</p>
						</Button> */}
					</div>
				}
				footer={<span></span>}
			/>
			<ModalError
				open={openModalError}
				handleClose={() => setOpenModalError(false)}
				errorMessage={
					<div className="flex flex-col gap-y-5 text-center items-center">
						<p className="text-2xl">Commission withdrew unsuccessful</p>
						{error ? (
							<p className="text-sm text-typo-secondary">Reason: {error}</p>
						) : null}
						<Button
							size="lg"
							variant="primary"
							className="px-4 py-2 !text-center w-full !flex !items-center"
							onClick={() => setOpenWithDraw(true)}>
							<p className="w-full text-center">Try again</p>
						</Button>
					</div>
				}
				footer={<span></span>}
			/>
			<ModalLoadingWithDraw
				open={openModalLoading}
				onClose={() => setOpenModalLoading(false)}
			/>
		</div>
	);
};

export default ReferralStatistic;
