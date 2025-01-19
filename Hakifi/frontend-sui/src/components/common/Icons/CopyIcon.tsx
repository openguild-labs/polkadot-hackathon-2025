import clsx from "clsx";

const CopyIcon = ({ className = "" }: { className?: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			className={clsx(className || "lg:w-6 lg:h-6 w-5 h-5")}
		>
			<path
				fill="currentColor"
				d="M5.221 8.667v11.111H3V8.667zM16.333 8.667v11.11H14.11V8.668zM20.779 4.222v13.333h-2.222V4.222zM14.111 19.777V22H5.222v-2.222zM14.112 6.444v2.222h-8.89V6.444zM18.556 2v2.222h-8.89V2z"
			/>
		</svg>
	);
};

export default CopyIcon;
