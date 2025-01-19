"use client";

import QRIcon from "@/components/common/Icons/QRIcon";
import FaceBookIcon from "@/components/common/Icons/FacebookIcon";
import TelegramIcon from "@/components/common/Icons/TelegramIcon";
import TwitterIcon from "@/components/common/Icons/TwitterIcon";
import {
	FacebookShareButton,
	TwitterShareButton,
	TelegramShareButton,
} from "next-share";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ModalQR from "../modal/ModalQR";
import ModalManagerReferralCode from "../modal/ModalManagerReferralCode";
import useWalletStore from "@/stores/wallet.store";
import { Wallet } from "@/@type/wallet.type";
import ModalCreateRefCode from "../modal/ModalCreateRefCode";
import ModalListFriend from "../modal/ModalListFriend";
import { getReferralCodeInfo } from "@/apis/referral.api";
import ModalSuccess from "@/components/common/Modal/ModalSuccess";
import ModalError from "@/components/common/Modal/ModalError";
import useReferralStore from "@/stores/referral.store";
import Copy from "@/components/common/Copy";
import Button from "@/components/common/Button";
import ProgressBar from "@/components/common/Progressbar.tsx";
import { levels } from "../constant";
import ModalEditRefDescription from "../modal/ModalEditRefDescription";
import { formatNumber } from "@/utils/format";
type TProps = {};

const ReferralInfo: React.FC<TProps> = () => {
	const searchParams = useSearchParams();
	const [openModalEditDesRef, setOpenModalEditDesRef, userStats, getUserStats] =
		useReferralStore((state) => [
			state.openModalEditDesRef,
			state.setOpenModalEditDesRef,
			state.userStats,
			state.getUserStats,
		]);
	const [openModalQR, setOpenModalQR] = React.useState(false);
	const [openModalManager, setOpenModalManager] = React.useState(false);
	const [openModalListFriend, setOpenModalListFriend] = React.useState(false);
	const [openModalCreate, setOpenModalCreate] = React.useState(false);
	const [infoCode, setInfoCode] = React.useState<any>({});
	const [openModalSuccess, setOpenModalSuccess] = React.useState(false);
	const [openModalError, setOpenModalError] = React.useState(false);
	const [wallet] = useWalletStore((state) => [state.wallet]);
	const [infoCreateCode, setInfoCreateCode] = React.useState<any>({});
	const [dataRefCode, setDataRefCode] = React.useState<any>({});
	const code = searchParams.get("referral");
	const url = `${process.env.NEXT_PUBLIC_APP_URL}/commission?ref=${wallet?.defaultMyRefCode}`;
	const hashtags = ["sui.hakifi.io,ChangeRiskToPayback"];
	const hashtag = "#sui.hakifi.io";
	const title = "sui.hakifi.io";
	const listItem = [
		{
			key: "qr",
			render: () => (
				<Button
					size="lg"
					onClick={() => setOpenModalQR(true)}
					className="flex w-full h-full !rounded-[2px] items-center justify-center gap-x-1  !bg-background-primary p-2 text-typo-tertiary"
					variant="primary" pointClassName="!bg-support-black">
					<QRIcon />
				</Button>
			),
		},
		{
			key: "facebook",
			render: () => (
				<FacebookShareButton
					url={url}
					hashtag={hashtag}
					quote={title}
					style={{ width: "100%", height: "100%" }}>
					<Button
						size="lg"
						className="w-full gap-x-1 h-full !rounded-[2px] flex items-center justify-center !text-support-white !bg-[#1877F2] p-2"
						variant="primary" pointClassName="!bg-support-white">
						<FaceBookIcon />
					</Button>
				</FacebookShareButton>
			),
		},
		{
			key: "twitter",
			render: () => (
				<TwitterShareButton
					url={url}
					style={{ width: "100%", height: "100%" }}
					hashtags={hashtags}
					title={title}>
					<Button
						variant="outline"
						className="flex w-full !h-full !rounded-[2px] items-center justify-center  gap-x-1 !bg-support-black p-2 !text-support-white"
						size="lg" pointClassName="!bg-divider-secondary">
						<TwitterIcon fill="transparent" />
					</Button>
				</TwitterShareButton>
			),
		},
		{
			key: "qr",
			render: () => (
				<TelegramShareButton
					url={url}
					style={{ width: "100%", height: "100%" }}
					title={title}>
					<Button
						size="lg"
						variant="primary"
						pointClassName="!bg-support-white"
						className="flex w-full !h-full !rounded-[2px] items-center justify-center  gap-x-1  !bg-[#0088CC] p-2 !text-support-white">
						<TelegramIcon />
					</Button>
				</TelegramShareButton>
			),
		},
	];

	const { level, nextLevel } = React.useMemo(() => {
		if (wallet?.level) {
			const levelIndex = levels.findIndex(
				(item: { level: number }) => item.level === (wallet?.level || 0)
			);
			const level = levels[levelIndex];
			return {
				level,
				nextLevel: levels[levelIndex + 1],
			};
		} else
			return {
				level: {
					level: 1,
					rate: 1,
					max: 20000,
				},
				nextLevel: levels[0],
			};
	}, [wallet]);
	useEffect(() => {
		const handleGetReferralCodeInfo = async () => {
			try {
				const referralCodeInfo = await getReferralCodeInfo(
					wallet?.defaultMyRefCode || ""
				);
				setDataRefCode(referralCodeInfo);
			} catch (err) {
				console.log(err);
			}
		};
		handleGetReferralCodeInfo();
	}, [wallet?.defaultMyRefCode]);
	return (
		<div>
			<div className="flex w-full items-center justify-between">
				<div className="border border-divider-secondary flex items-center justify-between w-full p-3 rounded-md bg-support-black">
					<p className="text-sm">
						<p className="text-typo-secondary lg:text-sm text-xs">
							Invite code
						</p>{" "}
						<Copy
							text={code || (wallet?.defaultMyRefCode as string)}
							prefix={
								<p className="lg:text-xl text-sm text-typo-accent">
									{code || wallet?.defaultMyRefCode}
								</p>
							}
						/>
					</p>
					<Button
						onClick={() => setOpenModalManager(true)}
						variant="primary"
						size="md"
						className="text-sm !rounded-[2px]">
						Manage code
					</Button>
				</div>
			</div>
			<div>
				<div className="mt-5 flex flex-col w-full items-start justify-start gap-y-2">
					<p className="lg:text-base text-sm text-typo-primary">Invite link</p>
					<div className="lg:text-sm text-xs text-typo-secondary">
						You get:
						<span className="text-typo-primary">
							{" "}
							{dataRefCode.myPercent * 100}%
						</span>{" "}
						- Your friends get:{" "}
						<span className="text-typo-primary">
							{100 - dataRefCode.myPercent * 100}%
						</span>
					</div>
				</div>
				<div className="mt-2 flex items-center gap-x-2 text-sm w-full">
					<Copy
						text={
							`${process.env.NEXT_PUBLIC_APP_URL}?ref=${wallet?.defaultMyRefCode}` as string
						}
						prefix={
							<input
								type="text"
								className="w-full bg-transparent text-typo-accent text-sm"
								value={`${process.env.NEXT_PUBLIC_APP_URL}?ref=${wallet?.defaultMyRefCode}`}
								readOnly
							/>
						}
						styleContent="w-full"
						className="w-full bg-support-black flex items-center text-typo-secondary border border-divider-secondary justify-between px-2 py-2 rounded-md"
					/>
				</div>
			</div>
			<div className="py-5 border-b border-divider-secondary grid w-full lg:grid-cols-2 grid-cols-4 lg:gap-3 gap-x-4">
				{listItem.map((item) => (
					<div key={item?.key} className="w-full h-full max-h-[42px]">
						{item.render()}
					</div>
				))}
			</div>
			<div className="border border-divider-secondary bg-support-black rounded-md mt-5 mb-4">
				<div className="p-3">
					<p className="text-typo-primary text-sm">Current commission rate</p>
					<p className="lg:text-2xl text-xl text-typo-accent mt-4 mb-3">
						{level.rate}%
					</p>
					<div className="flex flex-col gap-y-1">
						<div className="flex items-center text-xs justify-between">
							<p className="text-typo-secondary">
								<span className="text-typo-primary">
									${formatNumber(userStats?.totalFriendsMargin,6)}
								</span>
								/${level.max}
							</p>
							<p className="text-typo-secondary">
								Next level:{" "}
								<span className="text-typo-accent">{nextLevel.rate}%</span>
							</p>
						</div>
						<ProgressBar
							value={userStats?.totalFriendsMargin as number}
							max={level.max}
							size={"md"}
						/>
					</div>
				</div>
			</div>
			<ModalQR
				openModalQR={openModalQR}
				handleCloseModalQR={() => setOpenModalQR(false)}
				userInfoCode={wallet as Wallet}
			/>
			<ModalManagerReferralCode
				open={openModalManager}
				handleCloseModalManager={() => setOpenModalManager(false)}
				handleOpenModalEdit={() => setOpenModalEditDesRef(true)}
				handleOpenModalCreate={() => setOpenModalCreate(true)}
				setInfoCode={setInfoCode}
				handleOpenModalListFriend={() => setOpenModalListFriend(true)}
			/>
			<ModalEditRefDescription
				isOpen={openModalEditDesRef}
				onRequestClose={() => {
					setOpenModalEditDesRef(false);
					setOpenModalManager(true);
				}}
				infoCode={infoCode}
			/>
			<ModalCreateRefCode
				isOpen={openModalCreate}
				onRequestClose={() => {
					setOpenModalCreate(false);
				}}
				handleOpenModalSuccess={() => setOpenModalSuccess(true)}
				handleOpenModalError={() => setOpenModalError(true)}
				setInfoCreate={setInfoCreateCode}
				handleOpenModalManager={() => setOpenModalManager(true)}
			/>
			<ModalListFriend
				open={openModalListFriend}
				handleClose={() => {
					setOpenModalListFriend(false);
					setOpenModalManager(true);
				}}
				infoCode={infoCode}
			/>
			<ModalSuccess
				open={openModalSuccess}
				handleClose={() => {
					setOpenModalSuccess(false);
					setOpenModalManager(true);
				}}
				title=""
				footer={null}
				successMessage={
					<div className="w-full text-center">
						<p className="text-typo-primary lg:text-2xl text-xl text-center">
							Created successfully
						</p>
						<p className="lg:text-base text-sm mt-3 text-typo-secondary text-center">
							Referral code
							<span className="mx-1 lg:text-base text-sm text-typo-accent">
								{infoCreateCode?.code}
							</span>
							successfully generated
						</p>
					</div>
				}
			/>
		</div>
	);
};

export default ReferralInfo;
