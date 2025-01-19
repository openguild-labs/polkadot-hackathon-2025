import { capitalize } from "@/utils/helper";
import { clsx } from "clsx";

type TProps = {
	value: "BULL" | "BEAR";
};
const variantStyle = {
	BULL: {
		className: "bg-positive-label",
	},
	BEAR: {
		className: "bg-negative-label",
	},
};

const Label = ({ value }: TProps) => {
	const style = variantStyle[value];
	return (
		<div
			className={clsx(
				"font-semibold text-xs rounded-[2px] px-4 lg:py-1 py-0.5 text-center text-typo-primary max-w-max",
				style?.className
			)}
		>
			{(value)}
		</div>
	);
};

export default Label;
