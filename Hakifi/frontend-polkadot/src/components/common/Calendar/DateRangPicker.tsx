"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";

import Button from "@/components/common/Button";
import { Calendar } from "@/components/common/Calendar/Base";
import { useIsTablet } from "@/hooks/useMediaQuery";
import useToggle from "@/hooks/useToggle";
import { cn } from "@/utils";
import CalendarIcon from "../Icons/CalendarIcon";
import Popup from "../Popup";

type DateRangePickerProps = {
	children?: React.ReactNode;
	onChange: (range: DateRange) => void;
	labelClassName?: string;
	className?: string;
	open?: boolean;
	range?: DateRange;
};

export const DateRangePicker = React.forwardRef<
	HTMLButtonElement,
	DateRangePickerProps
>(({ children, onChange, className, labelClassName, range }, forwardedRef) => {
	const isTablet = useIsTablet();
	const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(
		range
	);
	const { toggle, handleToggle } = useToggle();
	const handleOnChangeStatus = () => {
		handleToggle();
		if (!range?.from && !range?.to) {
			setSelectedDate(undefined);
		}
	};
	const handleOnChangeDate = () => {
		onChange(selectedDate as DateRange);
		handleToggle();
	};

	return (
		<div className={cn("gap-2 border-transparent", className)}>
			<Popup
				isOpen={toggle}
				handleOnChangeStatus={handleOnChangeStatus}
				classContent="bg-background-tertiary border-divider-secondary rounded-md p-5"
				content={
					<Calendar
						formatters={
							{
								// formatCaption: (caption) => `W${caption}`,
							}
						}
						initialFocus
						mode="range"
						defaultMonth={selectedDate?.from}
						selected={selectedDate}
						onSelect={(date) => setSelectedDate(date as DateRange)}
						numberOfMonths={1}
						footer={
							<Button
								size="lg"
								variant="primary"
								className="justify-center w-full mt-8 !rounded-[2px]"
								onClick={handleOnChangeDate}
							>
								Confirm
							</Button>
						}
					/>
				}
			>
				<section className={cn(toggle ? "[&>*]:text-typo-accent [&>*]:border-typo-accent [&>button>section>svg>path]:fill-background-primary" : "[&>*]:text-typo-secondary")}>
					{children ? (
						children
					) : (
						<Button size="lg" ref={forwardedRef} className="">
							<CalendarIcon />
						</Button>
					)}
				</section>
			</Popup>
		</div>
	);
});
