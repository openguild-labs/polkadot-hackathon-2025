import AccordionWrapper from "@/components/common/Accordion";
import DiscordIcon from "@/components/common/Icons/DiscordIcon";
import MailIcon from "@/components/common/Icons/MailIcon";
import TelegramIcon from "@/components/common/Icons/TelegramIcon";
import TwitterIcon from "@/components/common/Icons/TwitterIcon";
import { navigations } from "@/configs/navigations";
import { useIsTablet } from "@/hooks/useMediaQuery";
import useAppStore from "@/stores/app.store";
import { cn } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

const Footer = () => {
	const router = useRouter();
	const { toggleOpenTerminology, setStartOnboard } = useAppStore();
	const handleTerminogyToggle = () => {
		router.push("/buy-cover");
		toggleOpenTerminology();
	};

	const handleTerminogyStatusToggle = () => {
		router.push("/buy-cover?status=true");

		toggleOpenTerminology();
	};

	const handleTutorialToggle = () => {
		router.push("/buy-cover",);
		setStartOnboard(true);
	};

	const isTablet = useIsTablet();
	const pathname = usePathname();
	const content = useMemo(() => {
		return [
			{
				label: "Categories",
				content: (
					<section className="text-body-14 text-typo-secondary px-4 flex flex-col">
						{navigations.map((nav) => {
							const isActive = pathname.includes(nav.href);

							return (
								// <Button
								// 	key={nav.title}
								// 	size="md"
								// 	className={cn(
								// 		"py-1 px-4 text-sm leading-[22px] tracking-[0.84px] font-determination uppercase duration-300",
								// 		isActive
								// 			? "!text-typo-accent"
								// 			: "hover:cursor-pointer text-typo-secondary hover:text-typo-accent",
								// 		className
								// 	)}
								// 	onClick={() => {
								// 		router.push(nav.href);
								// 	}}>
								// 	{nav.title}
								// </Button>
								<Link
									key={nav.title}
									href={nav.href}
									className={cn(
										"text-body-14 py-2 duration-300",
										isActive
											? "text-typo-accent"
											: "hover:cursor-pointer text-typo-secondary hover:text-typo-accent",
									)}
									target={nav.blank === true ? "_blank" : undefined}>
									{nav.title}
								</Link>
							);
						})}
					</section>
				),
			},
			{
				label: "On-Boarding",
				content: (
					<section className="text-body-14 text-typo-secondary px-4">
						<p className="py-2">Learn</p>
						<p className="py-2 cursor-pointer" onClick={handleTerminogyToggle}>
							Terminology System
						</p>
						<p className="py-2">Status System</p>
					</section>
				),
			},
			{
				label: "Documentation",
				content: (
					<section className="text-body-14 text-typo-secondary px-4 flex flex-col">
						<Link href="https://docs.hakifi.io/" target="_blank" className="py-2">
							Documents
						</Link>
						{/* <p>Blogs</p> */}
						<Link href="https://docs.hakifi.io/" target="_blank" className="py-2">
							Referral policy
						</Link>
					</section>
				),
			},
		];
	}, []);

	if (isTablet) {
		return (
			<section className="bg-background-tertiary border-t border-t-divider-secondary border-b-4 border-b-typo-accent">
				<section className="container flex flex-col items-center justify-between py-[18px] gap-5">
					<Link href="/" className="flex items-center">
						<Image
							src="/assets/images/icons/logo.png"
							alt="logo"
							width={112}
							height={42}
							className="h-[42px]"
						/>
					</Link>

					<section className="w-full">
						<AccordionWrapper
							body={content}
							labelClassName="lg:text-body-14 text-base bg-background-tertiary"
							contentClassName="bg-support-black"
						/>
					</section>
					<section className="text-body-16 text-support-black flex items-center gap-4">
						<Link href="https://twitter.com/hakifi_io" target="_blank">
							<TwitterIcon className="w-7 h-7" fill="#F37B23" />
						</Link>
						<Link href="https://t.me/Hakifi" target="_blank">
							<TelegramIcon className="w-7 h-7" fill="#F37B23" />
						</Link>
						<Link href="https://discord.gg/a3UshKtm" target="_blank">
							<DiscordIcon className="w-7 h-7" fill="#F37B23" />
						</Link>
						<Link href="mailto:hi@hakifi.io">
							<MailIcon className="w-7 h-7" fill="#F37B23" />
						</Link>
					</section>
					<section className="text-body-12 text-typo-secondary">
						<p>Copyright © 2023 Hakifi.All rights reserved.</p>
					</section>
				</section>
			</section>
		);
	}

	return (
		<section className="bg-background-support border-t flex items-center justify-center border-t-divider-secondary w-full border-b-4 border-b-typo-accent">
			<section className="px-[112px] flex items-start w-full pt-10 pb-[50px] justify-between">
				<section>
					<Link href="/" className="flex items-center">
						<Image
							src="/assets/images/icons/logo.png"
							alt="logo"
							width={106}
							height={40}
						/>
					</Link>
					<section className="text-body-16 text-typo-secondary mt-3">
						<p>Copyright © 2023 Hakifi.</p>
						<p>All rights reserved.</p>
					</section>
				</section>
				<section className="flex items-start gap-20">
					<section>
						<p className="text-heading-4 text-support-white uppercase">
							Categories
						</p>
						<section className="text-body-16 text-typo-secondary mt-4 flex flex-col gap-2">
							<Link href="/buy-cover">
								Buy Cover
							</Link>
							<Link href="/market">
								Market
							</Link>
							<Link href="/referral?tab=referral">Referral</Link>
						</section>
					</section>
					<section>
						<p className="text-heading-4 text-support-white uppercase">
							On-Boarding
						</p>
						<section className="text-body-16 text-typo-secondary mt-4 flex flex-col gap-2">
							<p className="cursor-pointer" onClick={handleTutorialToggle}>Tutorial</p>
							<p className="cursor-pointer" onClick={handleTerminogyToggle}>Terminology System</p>
							<p className="cursor-pointer" onClick={handleTerminogyStatusToggle}>Status System</p>
						</section>
					</section>
					<section>
						<p className="text-heading-4 text-support-white uppercase">
							Documentation
						</p>
						<section className="text-body-16 text-typo-secondary mt-4 flex flex-col gap-2">
							<Link href="https://docs.hakifi.io/" target="_blank">
								Documents
							</Link>
							{/* <p>Blogs</p> */}
							<Link href="https://docs.hakifi.io/" target="_blank">
								Referral policy
							</Link>
						</section>
					</section>
					<section>
						<p className="text-heading-4 text-support-white uppercase">
							Join the community
						</p>
						<section className="text-body-16 text-support-black mt-4 flex items-center gap-4">
							<Link href="https://twitter.com/hakifi_io" target="_blank">
								<TwitterIcon className="w-7 h-7" fill="#F37B23" />
							</Link>
							<Link href="https://t.me/Hakifi" target="_blank">
								<TelegramIcon className="w-7 h-7" fill="#F37B23" />
							</Link>
							<Link href="https://discord.gg/a3UshKtm">
								<DiscordIcon className="w-7 h-7" fill="#F37B23" />
							</Link>
							<Link href="mailto:hi@hakifi.io">
								<MailIcon className="w-7 h-7" fill="#F37B23" />
							</Link>
						</section>
					</section>
				</section>
			</section>
		</section>
	);
};

export default Footer;
