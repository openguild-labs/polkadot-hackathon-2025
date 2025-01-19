import React from 'react';

const CalendarIcon = ({ color, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path fill={color || "#A1A1A1"} d="M5 6v14H3V6zM21 6v14h-2V6zM19 4v2H5V4zM10 2v2H8V2zM16 2v2h-2V2zM19 8v2H5V8zM9 12v2H7v-2zM9 16v2H7v-2zM13 12v2h-2v-2zM13 16v2h-2v-2zM17 12v2h-2v-2zM17 16v2h-2v-2zM19 20v2H5v-2z" />
        </svg>

    );
};

export default CalendarIcon;
