const PencilIcon = ({ className="" }: { className?: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none" className={className}>
			<path
				d="M8.4 9.2H10v1.6H8.4V9.2zM10 7.6h1.6v1.6H10V7.6zM11.6 6h1.6v1.6h-1.6V6zM8.4 2.8H10v1.6H8.4V2.8z"
				fill="currentColor"
			/>
			<path
				d="M12.4 5.2H14v1.6h-1.6V5.2zM11.6 2.8h1.6v1.6h-1.6V2.8z"
				fill="currentColor"
			/>
			<path d="M10.8 2h1.6v2.4h-1.6V2z" fill="currentColor" />
			<path
				d="M11.6 3.6H14v1.6h-2.4V3.6zM6.8 10.8h1.6v1.6H6.8v-1.6zM5.2 6h1.6v1.6H5.2V6zM6.8 4.4h1.6V6H6.8V4.4zM9.2 2h1.6v1.6H9.2V2zM3.6 7.6h1.6v1.6H3.6V7.6zM2 9.2h1.6V14H2V9.2z"
				fill="currentColor"
			/>
			<path d="M2 12.4h4.8V14H2v-1.6z" fill="currentColor" />
		</svg>
	);
};

export default PencilIcon;
