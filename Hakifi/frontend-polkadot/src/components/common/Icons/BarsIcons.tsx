import React from 'react';

const BarIcons = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M18 3H2M18 10H8M18 17H2"
        stroke="#768394"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default BarIcons;
