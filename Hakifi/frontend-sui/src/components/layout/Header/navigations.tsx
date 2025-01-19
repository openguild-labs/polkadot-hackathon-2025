"use client";


import { navigations } from "@/configs/navigations";

import { cn } from "@/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import { directDocumentsPage } from '@/components/common/utils/header';

type Props = {
	className?: string;
};

const Navigation = ({ className }: Props) => {
	const pathname = usePathname();

	return (
		<div
			className={cn(
				"box-radius p-1 bg-light-2 hidden items-center lg:flex",
				className
			)}>
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
							"py-1 px-4 text-sm leading-[22px] tracking-[0.84px] font-determination uppercase duration-300",
							isActive
								? "text-typo-accent"
								: "hover:cursor-pointer text-typo-secondary hover:text-typo-accent",
							className
						)}
						target={nav.blank === true ? "_blank" : undefined}>
						{nav.title}
					</Link>
				);
			})}
			
		</div>
	);
};

export default Navigation;
