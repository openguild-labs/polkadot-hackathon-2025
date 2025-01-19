const ArrowIcons = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			{...props}
		>
			<path
				fill="currentColor"
				d="M1.667 8.81h16.667v2.381H1.667zM14.167 6.428h2.083v2.381h-2.083z"
			/>
			<path
				fill="currentColor"
				d="M14.167 11.19h2.083v2.381h-2.083zM12.083 13.571h2.083v2.381h-2.083zM10 15.952h2.083v2.381H10zM12.083 4.048h2.083v2.381h-2.083zM10 1.666h2.083v2.381H10z"
			/>
		</svg>
	);
};
export default ArrowIcons;
