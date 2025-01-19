const TickIcon = ({ color, ...props }: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			{...props}
		>
			<path
				d="M8 1.333A6.674 6.674 0 0 0 1.333 8 6.674 6.674 0 0 0 8 14.667 6.674 6.674 0 0 0 14.667 8 6.674 6.674 0 0 0 8 1.333zm-1.333 9.61-2.475-2.47.941-.945 1.533 1.53 3.53-3.53.942.944-4.47 4.47z"
				fill="#F37B23"
			/>
		</svg>
	);
};

export default TickIcon;