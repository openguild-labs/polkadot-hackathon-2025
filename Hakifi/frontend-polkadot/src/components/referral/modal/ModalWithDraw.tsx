import { withDraw } from "@/apis/referral.api";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { formatNumber } from "@/utils/format";
import Image from "next/image";
import React from "react";

interface ModalWithdrawProps {
	open: boolean;
	onClose: () => void;
	availableCommission: number;
	handleOpenModalLoading: () => void;
	handleCloseModalLoading: () => void;
	handleOpenModalSuccess: () => void;
	handleOpenModalError: () => void;
	setError: (error: string) => void;
}

const ModalWithdraw: React.FC<ModalWithdrawProps> = ({
	open,
	onClose,
	availableCommission,
	handleOpenModalLoading,
	handleCloseModalLoading,
	handleOpenModalSuccess,
	handleOpenModalError,
	setError
}) => {
	const handleWithDraw = async () => {
		try {
			handleOpenModalLoading();
			onClose();
			const res = await withDraw();
			if (res) {
				setTimeout(() => {
					handleCloseModalLoading();
					handleOpenModalSuccess();
				}, 2000);
			}
		} catch (err : any) {
			setError(err.response.data.message);

			return setTimeout(() => {
				handleCloseModalLoading();
				handleOpenModalError();
			}, 2000);
		}
	};
	return (
		<Modal isOpen={open} onRequestClose={onClose} modal useDrawer={false} contentClassName="px-4" descriptionClassName="!px-0" titleClassName="">
			<div className="flex flex-col items-center justify-center gap-y-5">
				<Image
					src="/assets/images/referral/icon_with_draw.png"
					className="mb-5 aspect-square w-[80px] h-[80px]"
					alt="icon_with_draw"
					width={80}
					height={80}
				/>

				<p className="text-2xl">Withdraw commission</p>
				<div className="text-2xl text-typo-secondary">
					<span className="ml-1 text-typo-accent">
						{formatNumber(availableCommission, 2)} USDT
					</span>
				</div>
				<div className="mt-5 w-full px-4">
					<Button
						className="w-full px-4 py-2"
						onClick={handleWithDraw}
						size="lg"
						variant="primary">
						<p className="w-full text-center text-base text-typo-tertiary">
							Confirm
						</p>
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalWithdraw;
