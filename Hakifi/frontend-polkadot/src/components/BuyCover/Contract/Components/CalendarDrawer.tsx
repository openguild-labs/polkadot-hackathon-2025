import Button from '@/components/common/Button';
import { Calendar } from '@/components/common/Calendar/Base';
import React, { memo } from 'react';
import { DateRange } from 'react-day-picker';

type CalendarDrawerProps = {
    onChange: (range: DateRange) => void;
    title: string
    range?: DateRange;
};

const CalendarDrawer = ({ range, onChange, title }: CalendarDrawerProps) => {
    const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(range);

    const handleOnChangeDate = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("onclick", selectedDate)
        onChange(selectedDate as DateRange);
    };

    return (
        <>
            <p className="my-4 text-body-20 text-center">
                {title}
            </p>

            <Calendar
                // initialFocus
                className="overflow-hidden"
                mode="range"
                defaultMonth={selectedDate?.from}
                selected={selectedDate}
                onSelect={(date) => setSelectedDate(date as DateRange)}
                numberOfMonths={1}
                footer={
                    <Button size="lg" variant="primary" className="justify-center w-full rounded-sm mt-8" onClick={handleOnChangeDate}>
                        Confirm
                    </Button>
                }
            />
        </>
    );
};

export default memo(CalendarDrawer);