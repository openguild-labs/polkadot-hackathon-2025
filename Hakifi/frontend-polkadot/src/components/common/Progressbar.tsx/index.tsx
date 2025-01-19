import React from "react";
import styles from "./ProgressBar.module.scss";
import clsx from "clsx";

type TProps = {
	value: number;
	max: number;
	size: "md" | "lg";
};

const ProgressBar = ({ value, max, size }: TProps) => {
	const percentage = (value / max) * 100;

	return (
		<div
			className={clsx({
				"h-0.5 w-full": size === "md",
				"h-1 w-full": size === "lg",
			})}
		>
			<div className={styles["horizontal-progress-bar"]}>
				<div
					className={styles["horizontal-progress-fill"]}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
};

export default ProgressBar;
