"use client";

import Modal from "@/components/common/Modal";
import { useIsTablet } from "@/hooks/useMediaQuery";
import useAppStore from "@/stores/app.store";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import useWalletStore from "@/stores/wallet.store";
import { useWallet } from "@suiet/wallet-kit";
import Button from "../common/Button";
import DrawerWrapper from "../common/Drawer";
import NotificationErrorIcon from "../common/Icons/NotificationErrorIcon";

const NetworkModal = () => {
	const { isSupportChain, toggleIsSupportChainModal } = useAppStore();
	const { removeItem } = useLocalStorage("auth-storage");
	const closeModal = () => toggleIsSupportChainModal(false);
	const { disconnect } = useWallet();
	const [reset] =
		useWalletStore((state) => [
			state.reset
		]);
	const [loading, setLoading] = useState(false);
	const changeChain = useCallback(async () => {
		try {
			setLoading(true);

		} catch (error) {
			console.log("Error: ", error);
		} finally {
			setLoading(false);
		}
	}, [loading]);

	const isTablet = useIsTablet();

	const handleDisconnect = () => {
		disconnect();
		reset();
		removeItem()
	};

	if (isTablet) {
		return (
			<DrawerWrapper
				isOpen={isSupportChain}
				handleOpenChange={closeModal}
				classNameTitle="!text-title-24 text-typo-primary"
				content={
					<section className="flex flex-col justify-center items-center p-4 pt-0">
						<NotificationErrorIcon />
						<div className="text-title-24 text-typo-primary mt-5">
							Connect Failed
						</div>

						<div className="text-body-14 text-typo-secondary mt-3 text-center">
							Hakifi is only supported on BNB Smart Chain. Please switch
							Networks in your Wallet to continue using the product.
						</div>

						{!loading ? (
							<section className="mt-8 flex items-center gap-4 flex-wrap flex-col w-full">
								<Button
									size="lg"
									onClick={changeChain}
									variant="primary"
									className=" w-full flex justify-center"
								>
									Switch network
								</Button>
								<Button
									size="lg"
									onClick={handleDisconnect}
									variant="outline"
									className="w-full flex justify-center"
								>
									Disconnect
								</Button>
							</section>
						) : (
							<Loader2 className="mt-8 animate-spin text-typo-primary h-24" />
						)}
					</section>
				}
			></DrawerWrapper>
		);
	}

	return (
		<Modal
			isOpen={isSupportChain}
			onRequestClose={closeModal}
			isMobileFullHeight={false}
			className="text-typo-primary"
			onInteractOutside={(e) => {
				e.preventDefault();
			}}
			modal={true}
			contentClassName="!z-[52]"
			overlayClassName="z-[50]"
			desClassName="!overflow-hidden"
		>
			<section className="flex flex-col justify-center items-center">
				<NotificationErrorIcon />
				<div className="text-title-24 text-typo-primary mt-5">
					Connect Failed
				</div>

				<div className="text-body-16 text-typo-secondary mt-3 text-center">
					Hakifi is only supported on BNB Smart Chain. Please switch Networks in
					your Wallet to continue using the product.
				</div>
				{!loading ? (
					<section className="mt-8 flex items-center gap-4 flex-wrap flex-col w-full">
						<Button
							size="lg"
							onClick={changeChain}
							variant="primary"
							className=" w-full flex justify-center"
						>
							Switch network
						</Button>
						<Button
							size="lg"
							onClick={handleDisconnect}
							variant="outline"
							className="w-full flex justify-center"
						>
							Disconnect
						</Button>
					</section>
				) : (
					<Loader2 className="mt-8 animate-spin text-typo-primary h-[98px]" />
				)}
			</section>
		</Modal>
	);
};

export default NetworkModal;
