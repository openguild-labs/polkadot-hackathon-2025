import React, { useEffect, useState } from "react";
import { useNotification } from "@/components/common/Notification";
import { getListReferralCode, updateDefaultCode } from "@/apis/referral.api";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination";
import Copy from "@/components/common/Copy";
import Tag from "@/components/common/Tag";
import Button from "@/components/common/Button";
import ListIcons from "@/components/common/Icons/ListIcons";
import PencilIcon from "@/components/common/Icons/PencilIcon";
import useWalletStore from "@/stores/wallet.store";
import { Wallet } from "@/@type/wallet.type";
import { formatNumber } from "@/utils/format";
type TProps = {
	open: boolean;
	handleOpenModalEdit: () => void;
	handleOpenModalCreate: () => void;
	handleCloseModalManager: () => void;
	setInfoCode: React.Dispatch<React.SetStateAction<any>>;
	handleOpenModalListFriend: () => void;
};
const ITEMS_PER_PAGE = 4;

type Referral = {
	id: string;
	userId: string;
	code: string;
	myPercent: number;
	description: string;
	totalFriends: number;
	createdAt: string;
	updatedAt: string;
};

const ModalManagerReferralCode: React.FC<TProps> = ({
	open,
	handleOpenModalEdit,
	handleOpenModalCreate,
	handleCloseModalManager,
	setInfoCode,
	handleOpenModalListFriend,
}) => {
	const [wallet, setWallet] = useWalletStore((state) => [
		state.wallet,
		state.setWallet,
	]);
	const notifications = useNotification();
	const [listCode, setListCode] = useState<Referral[]>([]);
	useEffect(() => {
		const handleGetListCode = async () => {
			try {
				const res = await getListReferralCode();
				if (res) {
					setListCode(res);
				}
			} catch (err) {
				err;
			}
		};
		if (open === true) {
			handleGetListCode();
		}
	}, [open]);

	const handleSetdefaultMyRefCode = async (refCode: string) => {
		setWallet({ ...wallet, defaultMyRefCode: refCode } as unknown as Wallet);
		try {
			const res = await updateDefaultCode({ defaultMyRefCode: refCode });
			if (res) {
				notifications.success(`Set code ${refCode} as default successfully`);
			}
		} catch (err) {
			err;
		}
	};
	const [currentPage, setCurrentPage] = useState(0);

	const onNextPage = () => {
		setCurrentPage(currentPage + 1);
	};
	const onPrevPage = () => {
		setCurrentPage(currentPage - 1);
	};
	const { totalItems, totalPages, currentItems } = React.useMemo(() => {
		const totalItems = listCode.length;
		const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
		const startIndex = currentPage * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		const currentItems = listCode?.slice(startIndex, endIndex);
		return { totalItems, totalPages, startIndex, endIndex, currentItems };
	}, [listCode, currentPage]);
	return (
		<Modal
			title={
				<div className="flex flex-col items-start !text-start gap-y-1">
					<p className="text-typo-primary lg:text-2xl text-xl">
						Manage Referral Codes
					</p>
					<p className="lg:text-sm text-xs text-typo-secondary">
						You can create maximum 30 referral codes
					</p>
				</div>
			}
			titleClassName="!px-0"
			isOpen={open}
			onRequestClose={handleCloseModalManager}
			className="!text-typo-primary"
			contentClassName="lg:!max-w-[804px] px-4"
			descriptionClassName="!px-0"
			modal
			useDrawer={false}
		>
			<div>
				<div className="grid grid-cols-1 gap-4 lg:py-4 pb-4 pt-0 lg:grid-cols-2">
					{currentItems.map((item) => (
						<div
							key={item.id}
							className="col-span-1 w-full rounded-xxl bg-support-black border border-divider-secondary rounded-md p-4 lg:min-w-[373px]"
						>
							<div className="mb-3 flex items-center justify-between">
								<Copy
									text={item.code}
									prefix={item.code}
									styleContent="text-sm  lg:text-base text-typo-primary"
								/>
								{item?.code === wallet?.defaultMyRefCode ? (
									<Tag variant="success" text="Default" />
								) : (
									<Button
										className="bg-grey-2 px-3 py-1 lg:text-sm text-xs text-typo-primary"
										onClick={() => handleSetdefaultMyRefCode(item.code)}
										size="md"
										variant="outline"
									>
										Set as default
									</Button>
								)}
							</div>
							<div className="flex flex-col gap-y-1">
								<div className="flex items-center justify-between">
									<div className="lg:text-sm text-xs text-typo-secondary">
										You get/ Friends get
									</div>
									<div className="lg:text-sm text-xs text-typo-accent">
										{formatNumber(item.myPercent * 100, 2)}%/
										{formatNumber(100 - item.myPercent * 100, 2)}%
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="lg:text-sm text-xs text-typo-secondary">
										Invite link
									</div>
									<Copy
										text={`${process.env.NEXT_PUBLIC_APP_URL}?ref=${item.code}`}
										prefix={
											<p className="max-w-[166px] truncate lg:text-sm text-xs text-typo-primary">{`${process.env.NEXT_PUBLIC_APP_URL}?ref=${item.code}`}</p>
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<div className="lg:text-sm text-xs text-typo-secondary">
										Friends
									</div>
									<div className="flex items-center gap-x-1">
										<p className="lg:text-sm text-xs text-typo-primary">
											{item.totalFriends}
										</p>
										<button
											onClick={() => {
												setInfoCode(item);
												handleOpenModalListFriend();
												handleCloseModalManager();
											}}
											className="text-typo-secondary"
										>
											<ListIcons />
										</button>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="lg:text-sm text-xs text-typo-secondary">
										Note
									</div>
									<button
										className="flex items-center gap-x-1 text-typo-secondary"
										onClick={() => {
											handleOpenModalEdit();
											handleCloseModalManager();
											setInfoCode(item);
										}}
									>
										<p className="max-w-[166px] truncate lg:text-sm text-xs text-typo-primary">
											{item?.description || "-----"}
										</p>
										<PencilIcon />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
				{totalItems > ITEMS_PER_PAGE ? (
					<div className="mb-5">
						<Pagination
							onPreviousPage={onPrevPage}
							canPreviousPage={currentPage > 0}
							onNextPage={onNextPage}
							pageIndex={currentPage}
							pageCount={totalPages}
							canNextPage={currentPage < totalPages - 1}
							setPageIndex={setCurrentPage}
							limit={ITEMS_PER_PAGE}
						/>
					</div>
				) : null}
				{listCode.length === 30 ? (
					<Button
						onClick={() => {
							handleOpenModalCreate();
							handleCloseModalManager();
						}}
						className="w-full"
						size="lg"
						variant="primary"
						disabled={true}
					>
						<p className="text-center w-full">
							Maximum 30 referral codes reached
						</p>
					</Button>
				) : (
					<div className="flex justify-end">
						<Button
							onClick={() => {
								handleOpenModalCreate();
								handleCloseModalManager();
							}}
							className="w-full"
							size="lg"
							variant="primary"
							disabled={listCode.length === 30}
						>
							<p className="text-center w-full">Create referral code</p>
						</Button>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default ModalManagerReferralCode;
