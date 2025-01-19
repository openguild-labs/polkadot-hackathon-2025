import React from "react";

const CheckIcon = ({ color, ...props }: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width={props.width || 24}
			height={props.height || 24}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"
				fill={color || "#F37B23"}
			/>
		</svg>
	);
};

export default CheckIcon;

export const CheckIconDashed = ({ className = "" }: { className?: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			className={className || "lg:w-6 lg:h-6 w-5 h-5"}
		>
			<path
				d="M19.5 5H22v2.5h-2.5V5zM17 10V7.5h2.5V10H17zm-2.5 2.5V10H17v2.5h-2.5zM12 15h2.5v-2.5H12V15zm-2.5 2.5H12V15H9.5v2.5zm-2.5 0V20h2.5v-2.5H7zM4.5 15H7v2.5H4.5V15zm0 0H2v-2.5h2.5V15z"
				fill="currentColor"
			/>
		</svg>
	);
};
