import React, { FC, ReactNode } from 'react';
import { HiOutlineTrendingUp } from 'react-icons/hi';
import { usersCount } from '../../../config';
interface DataCardProps {
  value: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
}


const DataCard: FC<DataCardProps> = ({ title, value, icon, description }) => {
  return (
    <div className="dataCard relative gotham_font_bold  italic text-white flex flex-col justify-center items-center text-center mx-2 s:my-2 rounded-2xl border border-mobile">
      <div
        style={{
          fontSize: '26px',
          lineHeight: '38px'
        }}
        className="text-mobile"
      >
        {title}
      </div>
      <div
        className="pb-2 pt-3"
        style={{
          fontSize: '40px',
          lineHeight: '50px'
        }}
      >
        {value}
        {icon}
      </div>
      <div className="font-poppins text-base not-italic  font-normal">{description}</div>
    </div>
  );
};

const withPrefix = (money: string, prefix: string) => {
  return (
    <span>
      <span className="pr-1">{prefix}</span>
      {money}
    </span>
  );
};

const withSuffix = (money: string, suffix: string) => {
  return (
    <span>
      {money}
      <span className="pl-1">{suffix}</span>
    </span>
  );
};

const DataCards = () => {
  return (
    <ul className="mt-44 mb-7 s:mt-8 s:mb-16 flex s:flex-col">
      <DataCard title="LOW FEES" value={withPrefix('0.01', '<$')} description="Near’s Transaction Fees" />
      <DataCard title="LIGHTNING FAST" value={withSuffix('1-2', 'S')} description="Transaction Finality" />
      <DataCard
        title="GROWING FAST"
        value={usersCount}
        icon={<HiOutlineTrendingUp className="inline-block ml-2" />}
        description="Increasing Users"
      />
    </ul>
  );
};

export default DataCards;
