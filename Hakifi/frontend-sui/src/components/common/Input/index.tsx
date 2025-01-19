"use client";

import { cn } from "@/utils";
import React, { HTMLInputTypeAttribute, ReactElement, ReactNode, forwardRef, useEffect, useState } from "react";
export interface IInputProps {
	suffix?: ReactElement | ReactNode;
	prefix?: ReactElement | string;
	suffixClassName?: string;
	prefixClassName?: string;
	wrapperClassInput?: string;
	size: "md" | "lg";
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	value?: string;
	className?: string;
	type?: HTMLInputTypeAttribute;
	placeholder?: string;
	disabled?: boolean;
	autoFocus?: boolean;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	max?: number;
	classFocus?: string;
}

const Input = forwardRef<HTMLInputElement, IInputProps>(
	(
		{
			className,
			type,
			suffix,
			suffixClassName,
			wrapperClassInput,
			prefix,
			prefixClassName,
			size,
			onChange,
			value,
			autoFocus = false,
			classFocus,
			...props
		},
		ref
	) => {
		const [_focus, setFocus] = useState(false);
		const _handleOnFocus = () => {
			setFocus(true);
		};
		const _handleOnBlur = () => {
			setFocus(false);
		};
		useEffect(() => {
			window.blur();
		}, [_focus]);

		return (
			<section
				className={cn(
					"flex items-center justify-between bg-transparent px-2 text-typo-primary",
					size === "md" && "py-1",
					size === "lg" && "py-2",
					wrapperClassInput,
					_focus && classFocus
				)}>
				<section className="flex w-full items-center justify-normal gap-2">
					{prefix && (
						<div className={cn("flex items-center [&>path]:focus-within:fill-typo-accent",
							// _focus && "[&>svg>path]:fill-typo-accent", 
							prefixClassName)}>
							{prefix}
						</div>
					)}
					<input
						type={type}
						className={cn(
							"flex w-full focus-visible:outline-none focus-visible:border-primary-1 placeholder:text-typo-secondary bg-transparent h-6",
							size === "md" && "text-body-12",
							size === "lg" && "text-body-14",
							className
						)}
						value={value}
						onChange={onChange}
						ref={ref}
						{...props}
						onFocus={_handleOnFocus}
						autoFocus={autoFocus}
						onBlur={_handleOnBlur}
					/>
				</section>
				{suffix && (
					<div
						className={cn(
							"z-1 text-body-14 ml-2 whitespace-nowrap py-1 pl-2 text-typo-secondary",
							suffixClassName
						)}>
						{suffix}
					</div>
				)}
			</section>
		);
	}
);
Input.displayName = "Input";

export default Input;
