"use client";

import { useEffect, useMemo, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "./Dropdown";
import Input from "../Input";
import debounce from "lodash/debounce";
import SearchIcon from "../Icons/SearchIcon";
import clsx from "clsx";
import { cn } from "@/utils";

type TOption = { label: any; value: any; [x: string]: any };

type TProps = {
	size: "md" | "lg";
	placeholder: string | JSX.Element;
	value: string | string[];
	options: TOption[];
	onChange: (value: any) => void;
	isMultiple?: boolean;
	className?: string;
	isSearch?: boolean;
};

const SelectSearch = ({
	size,
	value,
	placeholder,
	options,
	onChange,
	isMultiple = false,
	className = "",
	isSearch = true,
}: TProps) => {
	const [search, setSearch] = useState("");
	const [open, setOpen] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState<TOption[]>(options);
	const debouncedSearch = debounce((value) => {
		if (search.length === 0 || value.length === 0) {
			setFilteredOptions(options);
			return;
		} else {
			const filtered = options.filter((item) =>
				item.label.toLowerCase().includes(value.toLowerCase())
			);
			setFilteredOptions(filtered);
			return;
		}
	}, 500);
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		debouncedSearch(value);
		setSearch(value);
	};
	const renderValue = useMemo(() => {
		if (isMultiple === true) {
			return value.length > 0 && Array.isArray(value)
				? value.join(", ")
				: placeholder;
		} else {
			const selected = options.find((item) => item.value === value);
			return selected?.label || placeholder;
		}
	}, [isMultiple, value, options, placeholder]);
	useEffect(() => {
		if (options) {
			setFilteredOptions(options);
		}
	}, [options, open]);

	return (
		<DropdownMenu onOpenChange={() => setOpen((prev) => !prev)} open={open}>
			<DropdownMenuTrigger
				className={clsx(
					className,
					"border border-divider-secondary py-2 px-2 rounded-md flex items-center justify-between"
				)}
				inset={open}>
				<div>{renderValue}</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-support-black max-h-[320px] overflow-y-auto custom-scroll border-divider-secondary border">
				{isSearch ? (
					<DropdownMenuGroup>
						<DropdownMenuLabel>
							<Input
								size={size}
								onChange={handleSearchChange}
								wrapperClassInput="rounded-md border border-divider-secondary focus:border-background-primary w-full"
								prefix={<SearchIcon className="w-4 h-4" />}
								placeholder="Search"
								// value={search}
								onBlur={(e: any) => e.target.focus()}
								classFocus="bg-background-secondary border-background-primary"
							/>
						</DropdownMenuLabel>
					</DropdownMenuGroup>
				) : null}
				<DropdownMenuGroup>
					{filteredOptions?.map((item) => (
						<DropdownMenuCheckboxItem
							key={item.value as string}
							onClick={() => onChange(item.value)}
							checked={value.includes(item.label)}
							className={cn(
								" text-typo-secondary",
								!value && "hover:bg-background-secondary"
							)}>
							{item.label}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SelectSearch;
