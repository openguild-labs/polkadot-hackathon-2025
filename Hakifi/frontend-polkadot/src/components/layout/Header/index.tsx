"use client";

import Button from "@/components/common/Button";
import BarIcons from "@/components/common/Icons/BarsIcons";
import CloseIcon from "@/components/common/Icons/CloseIcon";
import Modal from "@/components/common/Modal";
import { Skeleton } from "@/components/common/Skeleton";
import { navigations } from "@/configs/navigations";
import { cn } from "@/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useState } from "react";
import Navigation from "./navigations";

const ConnectWallet = dynamic(() => import("./ConnectWallet"), {
	ssr: false,
	loading: () => (
		<Skeleton className="h-10 w-10 rounded-full sm:w-[167px] sm:!rounded" />
	),
});

function Header() {
	// const [isOpenMobileNav, toggleOpenMobileNav] = useCycle(false, true);
	// const { handleToggle, toggle } = useToggle();
	const pathname = usePathname();
	const router = useRouter();
	/**
	 * Uncomment when apply get config chart
	 */
	// const getChartConfig = async () => {
	//     const [err, response] = await handleRequest<ChartConfig>(getUpdateChartConfigApi());

	//     if (err) {
	//         console.log("Get chart config is error with message", err);
	//         return;
	//     }

	//     if (response) {
	//         const { data: config } = response;
	//         setChartConfig(config);
	//     }
	// };

	// useEffect(() => {
	//     getChartConfig();
	// }, []);

	const [isOpen, setIsOpen] = useState(false);
	const handleToggleIsOpen = () => {
		setIsOpen((status) => !status);
	};

	const handleOnClick = (href: string) => {
		router.push(href);
		handleToggleIsOpen();

	};

	return (
		<header className="z-30 h-17 bg-background-tertiary sticky top-0 border-b border-divider-secondary">
			<div className="flex h-full w-full items-center justify-between sm:px-5 sm:py-3 py-2 px-4">
				<Link href="/" className="flex items-center">
					<img
						src="/assets/images/icons/logo.png"
						alt="Logo"
						className="w-[106px] h-10 object-contain "
					/>
				</Link>

				{/* Main menu */}
				<Navigation />

				<section className="flex items-center gap-x-5">

					{/* {isConnected ? <NotificationIcon className="size-6" /> : null} */}
					<ConnectWallet />

					{/* <div>
						<WalletMultiButtonDynamic />
						<WalletDisconnectButtonDynamic />
					</div> */}

					<Modal
						isOpen={isOpen}
						onRequestClose={handleToggleIsOpen}
						isMobileFullHeight
						useDrawer={false}
						modal={true}
					>
						<>
							<p className="lg:text-2xl text-xl text-typo-primary my-5">Menu</p>
							<section className="flex flex-col items-start gap-y-5 ">
								{navigations.map((nav) => {
									const isActive = pathname.includes(nav.href);
									return (
										// <Button
										// 	key={nav.title}
										// 	size="md"
										// 	className={cn(
										// 		"duration-300 text-body-16",
										// 		isActive
										// 			? "text-typo-accent"
										// 			: "hover:cursor-pointer text-typo-secondary hover:text-typo-accent"
										// 	)}
										// 	onClick={() => {
										// 		router.push(nav.href);
										// 	}}>
										// 	{nav.title}
										// </Button>
										<Button
											size="md"
											key={nav.title}
											// href={nav.href}
											onClick={() => handleOnClick(nav.href)}
											className={cn(
												"duration-300 text-base uppercase font-medium",
												isActive
													? "text-typo-accent"
													: "hover:cursor-pointer text-typo-secondary hover:text-typo-accent"
											)}
										// target={nav.blank ? "_blank" : undefined}
										>
											{nav.title}
										</Button>
									);
								})}
							</section>
						</>
					</Modal>
					<Button
						size="lg"
						className="lg:hidden block"
						onClick={handleToggleIsOpen}>
						{isOpen ? <CloseIcon /> : <BarIcons className="w-6 h-6" />}
					</Button>
				</section>
			</div>
		</header>
	);
}

export default memo(Header);
