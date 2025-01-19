import React from 'react';

const CloseIcon = ({ color, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M2.5 2.5h2.143v2.143H2.5V2.5zm4.286 4.286H4.643V4.643h2.143v2.143zm2.143 2.143H6.786V6.786h2.143v2.143zm2.142 0H8.93v2.142H6.786v2.143H4.643v2.143H2.5V17.5h2.143v-2.143h2.143v-2.143h2.143v-2.143h2.142v2.143h2.143v2.143h2.143V17.5H17.5v-2.143h-2.143v-2.143h-2.143v-2.143h-2.143V8.93zm2.143-2.143v2.143h-2.143V6.786h2.143zm2.143-2.143v2.143h-2.143V4.643h2.143zm0 0V2.5H17.5v2.143h-2.143z" fill={color || "#A1A1A1"} />
        </svg>

    );
};

export default CloseIcon;
