import React from 'react';

const ExternalLinkIcon = ({ color, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M11.082 2.406h1.313V3.72h-1.313V2.406zM8.457 5.031H9.77v1.313H8.457V5.03zM9.77 3.719h1.312V5.03H9.77V3.72zM7.145 6.344h1.312v1.312H7.145V6.344zM3.863 1.75h2.625v1.313H3.863V1.75z" fill="#A1A1A1" />
            <path d="M8.457 1.75h4.594v1.313H8.457V1.75z" fill="#A1A1A1" />
            <path d="M11.738 1.75h1.313v4.594h-1.313V1.75zM2.55 3.063h1.313v7.874H2.551V3.064zM11.738 8.313h1.313v2.624h-1.313V8.313zM3.863 10.938h7.875v1.312H3.863v-1.313z" fill="#A1A1A1" />
        </svg>

    );
};

export default ExternalLinkIcon;
