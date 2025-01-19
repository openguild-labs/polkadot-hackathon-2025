import React from 'react';

const ChevronIcon = ({ color, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width={props.width || 16} height={props.height || 16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path fill={color || "#A1A1A1"} d="M12.666 5.333H3.333v1.333h9.333zM8.666 9.333H7.333v1.333h1.333zM10 8H6v1.333h4zM11.333 6.667H4.666v1.332h6.667z" />
        </svg>

    );
};

export default ChevronIcon;
