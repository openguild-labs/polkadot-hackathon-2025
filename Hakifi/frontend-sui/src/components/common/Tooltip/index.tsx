import { useIsTablet } from "@/hooks/useMediaQuery";
import { cn } from "@/utils";
import { Popover } from "@radix-ui/react-popover";
import { ReactNode } from "react";
import Button from "../Button";
import { PopoverContent, PopoverTrigger } from "../Popup/Popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui";
type TProps = {
	titleClassName?: string;
	contentClassName?: string;
	title: string | ReactNode;
	content: string | ReactNode;
	showArrow?: boolean;
	placement?: 'bottom' | 'left' | 'right' | 'top';
	isOpen?: boolean;
};

const TooltipCustom = ({ isOpen, titleClassName, contentClassName, title, content, showArrow = true, placement }: TProps) => {
	const isMobile = useIsTablet();
	if (isMobile) {
		return <Popover>
			<PopoverTrigger asChild>
				<Button size="md" className={cn("text-typo-primary", titleClassName)}>
					{title}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className={cn("max-w-52 p-2 text-body-14",
				"before:absolute before:top-[-5px] before:size-2.5 before:bg-background-tertiary before:left-[10%] before:border-r before:border-b before:rotate-[-135deg] before:border-divider-secondary",
			)} sideOffset={5}>
				{content}
			</PopoverContent>
		</Popover>;
	}
	return (
		<TooltipProvider>
			<Tooltip delayDuration={100} open={isOpen}>
				<TooltipTrigger className={cn("cursor-pointer !text-typo-primary text-body-16", titleClassName)} asChild>
					{title}
				</TooltipTrigger>
				<TooltipContent className={cn("relative text-typo-primary max-w-60", contentClassName)} sideOffset={10} side={placement}>
					{content}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default TooltipCustom;
