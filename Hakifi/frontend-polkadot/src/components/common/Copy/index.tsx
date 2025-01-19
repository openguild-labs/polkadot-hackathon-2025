import React from "react";
import CopyIcon from "../Icons/CopyIcon";
import { useNotification } from "../Notification";
import { copyToClipboard } from "@/utils/helper";
import { CheckIconDashed } from "../Icons/CheckIcon";
import styles from "./copy.module.scss";
type TProps = {
	text: string;
	className?: string;
	prefix?: string | React.JSX.Element;
	styleContent?: string;
	styleCopy?: string;
};
const Copy = ({ text, className, prefix, styleContent, styleCopy }: TProps) => {
	const toast = useNotification();
	const [isCopied, setIsCopied] = React.useState(false);
	const handleCopy = () => {
		toast.success("Copy successfully");
		copyToClipboard(text);
		setIsCopied(true);
	};
	React.useEffect(() => {
		if (isCopied) {
			const timeout = setTimeout(() => {
				setIsCopied(false);
			}, 3000);

			return () => {
				clearTimeout(timeout);
			};
		}
	}, [isCopied]);
	return (
		<button
			onClick={handleCopy}
			className={
				className ||
				"flex items-center justify-center gap-x-1.5 text-typo-primary/80 hover:text-typo-primary"
			}
		>
			{prefix ? <p className={styleContent}>{prefix}</p> : null}
			{isCopied ? (
				<p className={styles.check}>
					<CheckIconDashed className={styleCopy} />
				</p>
			) : (
				<p className={styles.copy}>
					<CopyIcon className={styleCopy} />
				</p>
			)}
		</button>
	);
};
export default Copy;
