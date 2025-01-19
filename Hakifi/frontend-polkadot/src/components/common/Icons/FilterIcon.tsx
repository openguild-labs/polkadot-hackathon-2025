import React from 'react';

const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fill="#A1A1A1" d="M1.334 1.333h13.333V3H1.334zM1.334 3h1.667v2.5H1.334zM3 5.5h1.667v1.667H3zM4.668 7.166h1.667v4.167H4.668zM6.334 11.333h1.667V13H6.334zM8 13h1.667v1.667H8zM13 3h1.667v2.5H13zM11.334 5.5h1.667v1.667h-1.667z" />
      <path fill="#A1A1A1" d="M9.668 7.166h1.667v5.833H9.668z" />
    </svg>
  );
};

export default FilterIcon;
