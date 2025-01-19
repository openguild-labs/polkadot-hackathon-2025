import React from 'react';

const ShutdownIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fill="currentColor" d="M4.667 13h6.667v1.667H4.667zM7.167 1.333h1.667V8H7.167zM1.333 11.334V4.667H3v6.667zM3 13v-1.667h1.667V13zM3 4.667V3h1.667v1.667zM11.333 13v-1.667H13V13zM11.334 4.666V3H13v1.667zM13 11.333V4.666h1.667v6.667z" />
    </svg>

  );
};

export default ShutdownIcon;
