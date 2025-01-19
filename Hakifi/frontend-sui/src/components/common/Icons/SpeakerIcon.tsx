import React from 'react';

const SpeakerIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M21 9h1v6h-1V9zM17 10h1v4h-1v-4zM13 10h1v4h-1v-4zM20 7h1v2h-1V7zM16 8h1v2h-1V8zM15 6h1v2h-1V6zM15 16h1v2h-1v-2zM19 5h1v2h-1V5zM18 3h1v2h-1V3zM20 15h1v2h-1v-2zM16 14h1v2h-1v-2zM19 17h1v2h-1v-2zM18 19h1v2h-1v-2zM2 10h1v4H2v-4zM3 9h2v6H3V9zM5 8h1v8H5V8zM6 7h1v10H6V7zM7 6h1v12H7V6zM8 5h3v14H8V5zM11 6h1v12h-1V6z" fill="#A1A1A1" />
        </svg>
    );
};

export default SpeakerIcon;
