import React from 'react';

const IndicatorIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3.333 4.667V10H2V4.667h1.333zM12.667 4.667V10h-1.334V4.667h1.334zM10 2v1.333H4.667V2H10zM10 11.333v1.334H4.667v-1.334H10zM4.667 3.333v1.334H3.333V3.333h1.334zM11.333 3.333v1.334H10V3.333h1.333zM4.667 10v1.333H3.333V10h1.334zM5.333 8v1.333h-.666V8h.666zM6 6.667V8h-.667V6.667H6zM7.333 5.333v1.334H6V5.333h1.333zM8 6.667V8h-.667V6.667H8zM9.333 8v1.333H8V8h1.333zM10 6.667V8h-.667V6.667H10zM11.333 10v1.333H10V10h1.333zM12.667 11.333v1.334h-1.334v-1.334h1.334zM14 12.667V14h-1.333v-1.333H14z" fill="#A1A1A1" />
    </svg>

  );
};

export default IndicatorIcon;
