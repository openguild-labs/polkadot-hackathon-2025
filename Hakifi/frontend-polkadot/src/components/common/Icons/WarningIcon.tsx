import React from 'react';

const WarningIcon = ({ color, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M10.737 2.888c-.288-.517-1.185-.517-1.473 0l-7.5 13.45a.756.756 0 0 0 .022.778c.151.238.422.384.715.384h15a.842.842 0 0 0 .713-.383.754.754 0 0 0 .023-.778l-7.5-13.45zm.097 12.238H9.167v-1.582h1.667v1.582zm-1.667-3.164V8.006h1.667v3.956H9.168z" fill={color || "#F6F6F6"} />
        </svg>

    );
};

export default WarningIcon;
