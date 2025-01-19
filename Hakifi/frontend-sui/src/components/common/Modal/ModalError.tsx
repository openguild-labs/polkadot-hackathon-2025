import React from "react";
import Modal from ".";
import ErrorIcon from "../Icons/ErrorIcon";

interface ModalErrorProps {
	errorMessage: string | JSX.Element;
	open: boolean;
	handleClose: any;
	title?: JSX.Element | string;
	footer: JSX.Element | null;
}

const ModalError: React.FC<ModalErrorProps> = ({
	errorMessage,
	open,
	handleClose,
	title,
	footer,
}) => {
	return (
		<Modal isOpen={open} onRequestClose={handleClose} title={title} contentClassName="px-4" descriptionClassName="!px-0">
			<div className="flex flex-col items-center gap-y-5">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="80"
					height="81"
					viewBox="0 0 80 81"
					fill="none"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M53.337 7.167c.886 0 1.733.35 2.356.976L72.36 24.81c.627.623.977 1.47.977 2.357v26.666c0 .887-.35 1.733-.977 2.357L55.693 72.856a3.319 3.319 0 0 1-2.356.977H26.67c-.887 0-1.733-.35-2.357-.977L7.647 56.19a3.319 3.319 0 0 1-.977-2.357V27.167c0-.887.35-1.734.977-2.357L24.313 8.143a3.319 3.319 0 0 1 2.357-.977h26.667zm3.327 45.3-4.7 4.7L39.997 45.2 28.03 57.167l-4.7-4.7L35.297 40.5 23.33 28.533l4.7-4.7L39.997 35.8l11.967-11.967 4.7 4.7L44.697 40.5l11.967 11.967z"
						fill="#D6013A"
					/>
				</svg>
				<div>{errorMessage}</div>
				<div className="w-full">{footer}</div>
			</div>
		</Modal>
	);
};

export default ModalError;
