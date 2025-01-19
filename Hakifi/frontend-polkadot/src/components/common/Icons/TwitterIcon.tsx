import React from "react";

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width="25"
			height="24"
			viewBox="0 0 25 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<rect
				x=".7"
				width="24"
				height="24"
				rx="2"
				fill={props.fill || "#F37B23"}
			/>
			<path
				d="m3.744 4 6.95 8.825L3.7 20h1.574l6.123-6.282L16.344 20H21.7l-7.34-9.321L20.87 4h-1.575l-5.639 5.785L9.1 4H3.744zM6.06 5.101h2.46L19.385 18.9h-2.46L6.059 5.1z"
				fill="currentColor"
			/>
		</svg>
	);
};

export default TwitterIcon;
