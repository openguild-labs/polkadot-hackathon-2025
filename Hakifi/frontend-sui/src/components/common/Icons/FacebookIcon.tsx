import React from "react";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width="25"
			height="24"
			viewBox="0 0 25 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<rect x=".7" width="24" height="24" rx="2" fill={props.fill} />
			<path
				d="M10.424 13.225V21.8h4.092v-8.575h3.05l.58-3.547h-3.63V7.377c0-.971.507-1.917 2.133-1.917H18.3V2.44s-1.499-.24-2.93-.24c-2.991 0-4.946 1.699-4.946 4.774v2.704H7.1v3.547h3.324z"
				fill="currentColor"
			/>
		</svg>
	);
};

export default FacebookIcon;
