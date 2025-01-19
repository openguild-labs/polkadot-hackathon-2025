import Button from "@/components/common/Button";
import ShutdownIcon from "@/components/common/Icons/ShutdownIcon";
import UserIcon from "@/components/common/Icons/UserIcon";
import Modal from "@/components/common/Modal";
import Popup from "@/components/common/Popup";
import { useIsTablet } from "@/hooks/useMediaQuery";
import useToggle from "@/hooks/useToggle";
import { useRouter } from "next/navigation";
import ShortAddress from "./ShortAddress";
import useWalletStore from "@/stores/wallet.store";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";
import { cn } from "@/utils";
import { useNotification } from "@/components/common/Notification";
import { getFaucet } from "@/apis/general.api";
import { useWallet } from "@suiet/wallet-kit";

const Profile = () => {
	const router = useRouter();
	const isTablet = useIsTablet();
	const { removeItem } = useLocalStorage("auth-storage");
	const { account, disconnect } = useWallet();
	const [reset, walletInfo, setWallet] = useWalletStore((state) => [
		state.reset,
		state.wallet,
		state.setWallet,
	]);
	const handleDisconnect = () => {
		disconnect();
		reset();
		removeItem();
	};

	const { toggle, handleToggle } = useToggle();
	const handleOnChangeStatusModal = () => {
		handleToggle();
	};
	const notification = useNotification();
	const handleFaucetUsdt = async () => {
		try {
			if (walletInfo?.isFaucet === false) {
				const response = await getFaucet();
				if (response) {
					notification.success("Faucet USDT successfully");
					setWallet({ ...walletInfo, isFaucet: true });
				}
			}
		} catch (error: any) {
			notification.error(error.response.data.message);
		}
	};
	if (isTablet) {
		return (
			<>
				<Modal
					isOpen={toggle}
					onRequestClose={() => handleToggle()}
					useDrawer={true}
					contentClassName="min-w-[180px]">
					<div className="min-w-[150px]">
						<p className="text-typo-primary text-title-24">Account</p>
						{/* <Link href="/referral">
							<div className="flex w-full gap-2 py-1 items-center mt-5 text-typo-secondary">
								<UserIcon />
								<p className="text-sm">Profile</p>
							</div>
						</Link> */}
						<Button
							size="md"
							className="flex gap-2 py-2 items-center w-full text-typo-secondary hover:bg-background-secondary"
							onClick={(e) => {
								router.push("/referral");
								handleToggle()
							}}>
							<UserIcon />
							<p className="">Profile</p>
						</Button>

						{walletInfo?.isFaucet === false ? (
							<Button
								size="md"
								className={cn(
									"flex gap-2 py-2 items-center w-full text-typo-secondary hover:bg-background-secondary"
								)}
								onClick={handleFaucetUsdt}>
								<img
									src="/assets/images/cryptos/usdt.png"
									alt="USDT"
									className="w-4 h-4"
								/>{" "}
								<p>Faucet</p>{" "}
							</Button>
						) : null}
						{/* <Link
							href={"https://faucet.solana.com/"}
							target="_blank"
							className={cn(
								"flex gap-2 py-2 items-center w-full text-typo-secondary hover:bg-background-secondary"
							)}>
							<img
								src="https://solana-cdn.com/cdn-cgi/image/width=100/https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png"
								alt="USDT"
								className="w-4 h-4"
							/>
							<p className="flex items-center text-sm">Faucet (Dev net)</p>{" "}
						</Link> */}

						<Button
							size="lg"
							className="flex gap-2 py-1 items-center w-full mt-4 text-typo-secondary"
							onClick={handleDisconnect}>
							<ShutdownIcon />
							<p className="text-base">Disconnect</p>
						</Button>
					</div>
				</Modal>
				<Button
					size="lg"
					onClick={handleOnChangeStatusModal}
					onDoubleClick={() => window.open("/referral", "_parent")}>
					{account ? (
						<img
							className="size-6"
							src={"https://github.com/shadcn.png"}
							alt={account.address}
						/>
					) : null}
				</Button>
			</>
		);
	}

	return (
		<Popup
			isOpen={toggle}
			handleOnChangeStatus={() => handleToggle()}
			align="center"
			sideOffset={12}
			content={
				<>
					{/* <Link href="/referral">
						<div className="flex w-full gap-2 py-1 items-center mt-5 text-typo-secondary">
							<UserIcon />
							<p className="text-sm">Profile</p>
						</div>
					</Link> */}
					<Button
						size="md"
						className="flex gap-2 px-3 py-2 items-center w-full text-typo-secondary hover:bg-background-secondary"
						onClick={(e) => {
							// redirect("/referral")
							// e.preventDefault();
							// handleToggle();
							// window.open("/referral", "_parent");
							router.push("/referral");
						}}>
						<UserIcon />
						<p className="">Profile</p>
					</Button>
					{walletInfo?.isFaucet === false ? (
						<Button
							size="md"
							className={cn(
								"flex gap-2 px-3 py-2 items-center w-full text-typo-secondary hover:bg-background-secondary"
							)}
							onClick={handleFaucetUsdt}>
							<img
								src="/assets/images/cryptos/usdt.png"
								alt="USDT"
								className="w-4 h-4"
							/>{" "}
							<p className=" text-body-14">Faucet USDT</p>
						</Button>
					) : null}
					{/* <Link
						href={"https://faucet.solana.com/"}
						target="_blank"
						className={cn(
							"flex gap-2 px-3 py-2 items-center w-full text-typo-secondary hover:bg-background-secondary"
						)}>
						<img
							src="https://solana-cdn.com/cdn-cgi/image/width=100/https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png"
							alt="USDT"
							className="w-4 h-4"
						/>
						<p className="text-body-14">
							Faucet SOL <span className="text-sm">(Dev net)</span>
						</p>
					</Link> */}

					<Button
						size="lg"
						variant="ghost"
						className="flex text-typo-secondary gap-2 px-3 py-2 items-center w-full"
						onClick={handleDisconnect}>
						<ShutdownIcon />
						<p className=" text-body-14">Disconnect</p>
					</Button>
				</>
			}
			classContent="left-4 bottom-10 min-w-[150px]">
			<ShortAddress
				toggle={toggle}
				onDoubleClick={() => router.push("/referral")}
				srcImage="/assets/images/avatar.png"
			/>
		</Popup>
	);
};

export default Profile;
