import React from "react";
import clsx from "clsx";
import Image, { StaticImageData } from "next/image";
interface StatCardProps {
  type: "Total Project" | "Total Staking" | "Unique Participant";
  count: number;
  label: string;
  icon: StaticImageData;
}

const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    <div
      className={clsx(
        "flex flex-1 flex-col gap-6 rounded-2xl bg-cover p-6 shadow-lg",
        {
          "bg-gradient-to-r from-[#132743] to-[#4D75B3] text-white border-2 border-[#A1C6FF]":
            type === "Total Project",
          "bg-gradient-to-r from-[#204275] to-[#4D75B3] text-white border-2 border-[#A1C6FF]":
            type === "Unique Participant",
          "bg-gradient-to-r from-[#3A66A9] to-[#7BA9EF] text-white border-2 border-[#A1C6FF]":
            type === "Total Staking",
        }
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <Image
          src={icon}
          alt={label}
          width={60}
          height={60}
          className="rounded-full"
        />
        <div className="text-right">
          <p className="text-[22px] leading-[29px] font-bold">{label}</p>
          <h2 className="text-[22px] leading-[26px]">{count}</h2>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
