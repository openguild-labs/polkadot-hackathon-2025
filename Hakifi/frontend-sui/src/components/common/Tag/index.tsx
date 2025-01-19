import { cn } from "@/utils";

type TProps = {
	variant: "primary" | "error" | "warning" | "disabled" | "success";
	text: string;
	className?: string
};
const variantStyle = {
	warning: {
		className: "bg-warning-label",
	},
	success: {
		className: "bg-positive-label",
	},
	error: {
		className: "bg-negative-label",
	},
	primary: {
		className: "bg-typo-accent",
	},
	disabled: {
		className: "bg-neutral-label !text-typo-tertiary",
	},
};

const Tag = ({ variant, text, className }: TProps) => {
	const style = variantStyle[variant];
	return (
		<div
			className={cn(
				"!text-body-12 rounded-sm w-fit px-2 text-center text-typo-primary h-5 flex justify-center items-center",
				style?.className,
				className
			)}
		>
			{text}
		</div>
	);
};

export default Tag;
