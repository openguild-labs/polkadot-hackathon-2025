"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/utils";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
import colors from "@/colors";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// const IconLeft = ({ ...props }) => {
// 	const [isHover, setIsHover] = React.useState(false);
// 	return (
// 		<ChevronIcon
// 			className={cn("size-6 rotate-90", props.className)}
// 			color={isHover ? colors.background.primary : colors.typo.primary}
// 			onMouseMove={() => setIsHover(true)}
// 			onMouseLeave={() => setIsHover(false)}
// 		/>
// 	);
// };
const IconRight = ({ ...props }) => {
    const [isHover, setIsHover] = React.useState(false);
    return (
        <ChevronIcon
            className={cn("size-6 -rotate-90", props.className)}
            color={isHover ? colors.background.primary : colors.typo.primary}
            onMouseMove={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        />
    );
};
function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-1", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center relative items-center",
                caption_label: "text-title-20 text-typo-primary",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "absolute left-1 ",
                nav_button_next: "absolute right-1 flex items-center justify-end",
                table: "w-full border-collapse space-y-1",
                head_row: "flex justify-between items-center",
                head_cell:
                    "text-typo-primary rounded-md w-9 text-body-12 sm:text-body-14",
                row: "flex w-full mt-2 justify-between items-center gap-4",
                cell: "size-9 text-center text-body-14 p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:text-typo-secondary [&:has([aria-selected])]:text-typo-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 text-typo-secondary",
                day: cn(
                    "size-9 p-0 font-normal aria-selected:opacity-100"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-background-secondary text-typo-accent rounded border [&:has([aria-selected].day_range_end)]:border-typo-accent last:[&:has([aria-selected])]:border-typo-accent",
                day_today: "text-typo-accent font-bold",
                day_outside:
                    "day-outside text-typo-secondary/80 opacity-50 aria-selected:text-grey-2 aria-selected:opacity-30",
                day_disabled: "text-typo-secondary opacity-50",
                day_range_middle:
                    "aria-selected:bg-background-secondary aria-selected:text-typo-accent border-transparent",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronIcon className="size-6 rotate-90 [&>path]:fill-typo-primary  [&>path]:hover:fill-typo-accent" />,
                IconRight: ({ ...props }) => <ChevronIcon className="size-6 -rotate-90  [&>path]:fill-typo-primary [&>path]:hover:fill-typo-accent" />,
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
