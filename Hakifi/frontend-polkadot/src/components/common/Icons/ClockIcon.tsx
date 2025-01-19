import React from 'react';

const ClockIcon = ({ color, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M17.5 4.375v11.25h-1.875V4.375H17.5zM4.375 4.375v11.25H2.5V4.375h1.875zM15.625 2.5v1.875H4.375V2.5h11.25zM13.75 10.938v1.874H8.125v-1.874h5.625z" fill="#F37B23" />
            <path d="M8.125 6.25H10v6.563H8.125V6.25zM15.625 15.625V17.5H4.375v-1.875h11.25z" fill="#F37B23" />
        </svg>
    );
};

export default ClockIcon;
