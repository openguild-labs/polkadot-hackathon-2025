import React from 'react';

const ClipboardIcon = ({ color, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M5.25 8.667v11.11H3V8.668h2.25zM16.5 8.667v11.11h-2.25V8.668h2.25zM21 4.222v13.334h-2.25V4.222H21zM14.25 19.778V22h-9v-2.222h9zM14.25 6.444v2.223h-9V6.444h9zM18.75 2v2.222h-9V2h9z" fill="#A1A1A1" />
        </svg>


    );
};

export default ClipboardIcon;
