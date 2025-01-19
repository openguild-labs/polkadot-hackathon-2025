import React from 'react';

const RefreshIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2 4.296h1.5v1.481H2V4.296zM3.5 2.814H5v1.482H3.5V2.814zM5 1.333h1.5v1.481H5V1.333zM5 7.259h1.5V8.74H5V7.26zM3.5 11.703H5v1.482H3.5v-1.482zM3.5 4.296H5v1.481H3.5V4.296zM3.5 5.777H5V7.26H3.5V5.777zM5 4.296h7.5v1.481H5V4.296zM14 5.777v7.408h-1.5V5.777H14zM12.5 14.666H5v-1.481h7.5v1.481z" fill="#A1A1A1" />
    </svg>
  );
};

export default RefreshIcon;
