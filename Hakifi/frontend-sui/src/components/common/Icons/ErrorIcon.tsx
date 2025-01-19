import React from 'react';

const ErrorIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M13.334 1.667a.83.83 0 0 1 .589.244l4.167 4.166a.83.83 0 0 1 .244.59v6.666a.83.83 0 0 1-.244.59l-4.167 4.166a.83.83 0 0 1-.59.244H6.668a.83.83 0 0 1-.59-.244l-4.166-4.166a.83.83 0 0 1-.244-.59V6.667a.83.83 0 0 1 .244-.59l4.167-4.166a.83.83 0 0 1 .589-.244h6.667zm.833 11.325-1.175 1.175L10 11.175 7.01 14.167l-1.175-1.175L8.825 10 5.834 7.008l1.175-1.175L10 8.825l2.992-2.992 1.175 1.175L11.175 10l2.992 2.992z" fill="#F6F6F6" />
        </svg>

    );
};

export default ErrorIcon;
