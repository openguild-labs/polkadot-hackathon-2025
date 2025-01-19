import React, { useState } from 'react';
import { openInNewTab } from '../../utils/openNewTab';

type IconLinkProps = {
  IconComponent: React.ElementType;
  href: string;
  className?: string;
};

export const IconLink: React.FC<IconLinkProps> = ({ IconComponent, href, className }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    openInNewTab(href);
    setClicked(true);
  };

  const handleMouseLeave = () => {
    setClicked(false);
  };

  const divClass = `w-10 h-10 bg-opacity-50 rounded-3xl bg-footerHoverColor flex justify-center items-center cursor-pointer md:mb-4 ${
    clicked ? '' : 'hover:bg-opacity-100'
  } ${className || ''}`;

  return (
    <div
      className={divClass}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
      style={{ minWidth: '40px', minHeight: '40px' }}
    >
      {/* <IconComponent /> */}
    </div>
  );
};
