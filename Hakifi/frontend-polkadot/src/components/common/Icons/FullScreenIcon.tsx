import React from 'react';

const FullScreenIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M2 3.5V2h4.5v1.5H2zM14 3.5V2H9.5v1.5H14zM14 12.5V14H9.5v-1.5H14zM2 12.5V14h4.5v-1.5H2z" fill="#A1A1A1" />
            <path d="M2 6.5V2h1.5v4.5H2zM14 6.5V2h-1.5v4.5H14zM14 9.5V14h-1.5V9.5H14zM2 9.5V14h1.5V9.5H2zM3.5 5V3.5H5V5H3.5zM12.5 5V3.5H11V5h1.5zM12.5 11v1.5H11V11h1.5zM3.5 11v1.5H5V11H3.5zM5 6.5V5h1.5v1.5H5zM11 6.5V5H9.5v1.5H11zM11 9.5V11H9.5V9.5H11zM5 9.5V11h1.5V9.5H5zM7.25 7.25v1.5h1.5v-1.5h-1.5z" fill="#A1A1A1" />
            <path d="M6.5 8v1.5H8V8H6.5zM6.5 6.5V8H8V6.5H6.5zM9.5 6.5V8H8V6.5h1.5zM9.5 9.5V8H8v1.5h1.5z" fill="#A1A1A1" />
        </svg>


    );
};

export default FullScreenIcon;
