"use client";

import * as React from 'react';

import Popup from '@/components/common/Popup';
import Button from '../Button';
import CalendarIcon from '../Icons/CalendarIcon';
import { Calendar } from './Base';
import useToggle from '@/hooks/useToggle';

type DatePickerProps = {
    children: React.ReactNode;
    date?: Date;
    onChange: (date: Date) => void;
    labelClassName?: string;
    open?: boolean;
};

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
    ({
        children,
        onChange,
        labelClassName,
        date
    }, forwardedRef) => {
        const { toggle, handleToggle } = useToggle(false);
        const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
        const handleOnChangeStatus = () => {
            handleToggle();
            if (!date) {
                setSelectedDate(undefined);
            }
            if (selectedDate !== date) {
                setSelectedDate(date);
            }
        };
        const handleOnChangeDate = (e: React.MouseEvent<HTMLButtonElement>) => {
            onChange(selectedDate as Date);
            handleToggle();
        };
        return (
            <Popup
                isOpen={toggle}
                handleOnChangeStatus={handleOnChangeStatus}
                classContent="bg-background-tertiary border-divider-secondary rounded-md p-5"
                content={
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => setSelectedDate(date as Date)}
                        initialFocus
                        footer={
                            <Button size="md" variant="primary" className="rounded text-button-16B py-3 w-full mt-8 justify-center" onClick={handleOnChangeDate}>
                                Confirm
                            </Button>
                        }
                    />
                }>
                {
                    children ? children : <Button size="lg" onClick={() => handleToggle()}>
                        <CalendarIcon />
                    </Button>
                }
            </Popup>
        );
    }
);

export default React.memo(DatePicker);
