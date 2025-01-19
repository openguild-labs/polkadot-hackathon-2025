import Image from "next/image";
import useAppStore from "@/stores/app.store";

const NoConnectWallet = () => {
	const { toggleConnectWalletModal } = useAppStore();
	return (
		<section className="flex flex-col items-center justify-center min-h-[300px] gap-2">
			<Image
				width={124}
				height={124}
				quality={100}
				src="/assets/images/icons/connect_wallet_icon.png"
				alt="No data"
			/>
			<section className="text-center text-typo-secondary">
				Please{" "}
				<span
					className="text-typo-accent cursor-pointer"
					onClick={() => toggleConnectWalletModal(true)}>
					Connect wallet
				</span>{" "}
				to use the feature
			</section>
		</section>
	);
};

export default NoConnectWallet;
