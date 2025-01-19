import React from 'react';

const NotificationErrorIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="80" height="81" viewBox="0 0 80 81" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M53.333 7.167c.886 0 1.733.35 2.356.976L72.356 24.81c.627.623.977 1.47.977 2.357v26.666c0 .887-.35 1.734-.977 2.357L55.689 72.857a3.32 3.32 0 0 1-2.356.976H26.666c-.887 0-1.733-.35-2.357-.976L7.643 56.19a3.319 3.319 0 0 1-.977-2.357V27.167c0-.887.35-1.734.977-2.357L24.309 8.143a3.319 3.319 0 0 1 2.357-.976h26.667zm3.337 45.3-4.7 4.7L40.003 45.2 28.037 57.167l-4.7-4.7L35.303 40.5 23.337 28.533l4.7-4.7L40.003 35.8 51.97 23.833l4.7 4.7L44.703 40.5 56.67 52.467z" fill="#D6013A" />
        </svg>
    );
};

export default NotificationErrorIcon;
