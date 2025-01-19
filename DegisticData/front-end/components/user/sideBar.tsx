import NextLink from "next/link";
import React, { useState } from "react";
import { Logo } from "../icons";
import { useAccount } from "wagmi";
import { CategoryItem } from "@/types";

export const Sidebar = ({categories}: {categories: CategoryItem[]}) => {
  const account = useAccount();
  const [selectedTag, setSelectedTag] = useState<string>("Dashboard");
  return (
    <div className="w-[15%] h-screen bg-white shadow-md flex flex-col">
      {/* Logo Section */}
      <div className="flex flex-col items-stretch px-4 border-b">
        <NextLink className="flex justify-start items-center gap-1" href="/">
          <Logo height={64} width={64} />
          <p className="font-bold text-xl">DegisticData</p>
        </NextLink>

        {/* Profile Section */}
        <div className="flex p-4 gap-2 items-center">
          <img
            src="./images/avatar.png" // Placeholder for profile picture
            alt="Profile"
            className="rounded-full w-6 h-6"
          />
          <p className="text-sm text-gray-500">
            {account.address?.substring(0, 4)}...
            {account.address?.substring(account.address.length - 5)}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow py-4 pl-8">
        <ul className="space-y-4">
          {categories.map((category: CategoryItem) => (
            <button
              className={`flex gap-2 items-center ${selectedTag == category.title ? "text-green-400" : "text-gray-500"} `}
              onClick={() => setSelectedTag(category.title)}
            >
              <i
                className={`${category.icon}`}
                color={`${selectedTag == category.title ? "#4ade80" : "#6b7280"}`}
              ></i>
              <span className="font-semibold">{category.title}</span>
            </button>
          ))}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t">
        <div className="bg-green-100 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Today</p>
            <p className="text-lg font-bold">1332</p>
            <p className="text-xs text-green-600">+678 km</p>
          </div>
          <img
            src="./images/truck.png" // Placeholder for truck image
            alt="Truck"
            className="w-20"
          />
        </div>
        <div className="mt-4 bg-blue-100 p-2 rounded-lg text-blue-600 text-sm">
          <span className="font-bold">A new shipment available</span>
          <br />
          <a href="#" className="underline">
            Details →
          </a>
        </div>
      </div>
    </div>
  );
};
