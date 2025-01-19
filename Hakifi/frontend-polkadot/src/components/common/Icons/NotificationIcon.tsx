import React from 'react';

const NotificationIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M9.666 2h4.445v2.222H9.666V2zM5.222 4.222h13.333v2.222H5.222V4.222zM5.222 17.556h13.333v2.222H5.222v-2.222z" fill="#A1A1A1" />
            <path d="M7.444 4.222v10H5.222v-10h2.222z" fill="#A1A1A1" />
            <path d="M7.444 13.111v2.222H3v-2.222h4.444z" fill="#A1A1A1" />
            <path d="M5.222 14.222v5.556H3v-5.556h2.222zM20.778 14.222v5.556h-2.222v-5.556h2.222z" fill="#A1A1A1" />
            <path d="M20.778 13.111v2.222h-4.445v-2.222h4.445zM14.111 19.778V22H9.667v-2.222h4.444z" fill="#A1A1A1" />
            <path d="M18.556 4.222v10h-2.223v-10h2.223z" fill="#A1A1A1" />
        </svg>

    );
};

export default NotificationIcon;
