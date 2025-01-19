import useAppStore from "@/stores/app.store";

export default function ConnectWalletMarket() {
	const { isOpenConnectWallet, toggleConnectWalletModal } = useAppStore();
	const onClickButton = () => {
		toggleConnectWalletModal(true);
	};

	return (
		<div className="flex flex-col items-center">
			<img
				className="w-20 h-20 lg:w-32 lg:h-32"
				src="/assets/images/icons/notification_icon.png"
				alt={"Connect wallet"}
			/>
			<p className="font-saira text-sm lg:text-base text-center font-medium text-typo-secondary">
				Please{" "}
				<a onClick={onClickButton} className="text-typo-accent cursor-pointer">
					Connect wallet
				</a>{" "}
				to use the feature
			</p>
		</div>
	);
}
