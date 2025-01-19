import { cn } from "@/utils";
import React from "react";

type CheckboxProps = {
	label: string;
	labelClassName?: string;
	checkClassName?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	checked?: boolean;
	size?: "lg" | "md";
};

const Checkbox = ({
	label,
	labelClassName,
	checkClassName,
	onChange,
	checked = false,
	size = "lg",
}: CheckboxProps) => {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-3",
				checked ? "text-typo-accent" : "text-typo-secondary"
			)}
		>
			<label
				className="relative flex items-center rounded-full cursor-pointer"
				htmlFor="check"
			>
				<input
					type="checkbox"
					className={cn(
						"before:content[''] peer relative cursor-pointer appearance-none rounded-sm border border-typo-secondary transition-all checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10",
						checked && "border-typo-accent",
						checkClassName,
						size === "lg" && "size-5",
						size === "md" && "size-4"
					)}
					onChange={onChange}
					checked={checked}
					id="check"
				/>
				<span
					className={cn(
						"absolute text-typo-tertiary transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100 bg-background-primary ",
						size === "lg" && "size-2.5",
						size === "md" && "size-2"
					)}
				></span>
			</label>
			<label
				className={cn(
					"cursor-pointer select-none",
					size === "lg" && "text-body-16",
					size === "md" && "text-body-14",
					labelClassName
				)}
				htmlFor="check"
			>
				{label}
			</label>
		</div>
	);
};

export default Checkbox;
