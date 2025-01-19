import React from 'react';

const ContractIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {

    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path fill="currentColor" d="M12.667 2.668H14v8h-1.333zM2 2.668h1.333v10.667H2zM3.333 14.668v-1.333h7.333v1.333z" />
            <path fill="currentColor" d="M10.667 11.334v-.667H14v.667zM10 11.334h.667v3.333H10zM11.333 13.334H12v.667h-.667z" />
            <path fill="currentColor" d="M10.667 14h.667v.667h-.667zM12 12.668h.667v.667H12zM12.667 12h.667v.667h-.667z" />
            <path fill="currentColor" d="M13.333 11.334H14v.667h-.667zM3.333 2.668V1.335h9.333v1.333zM4.667 5.334V4h6.667v1.333zM4.667 8V6.667h6.667V8zM4.667 10.668V9.335h4v1.333z" />
        </svg>

    );
};

export default ContractIcon;
