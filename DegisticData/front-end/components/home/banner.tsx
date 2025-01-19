import React, { useMemo } from "react";
import { Button } from "@nextui-org/button";

import { title, subtitle } from "@/components/primitives";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import NextLink from "next/link";

export const Banner = () => {
  const account = useAccount();

  const data = useMemo(() => {
    if (!account.address) return { title: "Waiting to connect", ref: "" };

    switch (account.address) {
      case process.env.NEXT_PUBLIC_OWNER_SMART_CONTRACT_ADDRESS:
        return {
          title: "Go to admin dashboard",
          ref: "/admin",
        };
      default:
        return {
          title: "Get Started",
          ref: `/${ethers.keccak256(`0x${account.address?.substring(2)}`)}`,
        };
    }
  }, [account.address]);

  return (
    <section
      className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 bg-[#FAFAFA]"
      id="home"
    >
      <div className="inline-block max-w-2xl text-center justify-center">
        <span className={title()}>Grow your business.&nbsp;</span>
        <span className={title({ color: "red" })}>We will take care&nbsp;</span>
        <span className={title()}>all your logistics.</span>
        <div className={subtitle({ class: "mt-4 flex justify-center w-full" })}>
          <img
            alt="polkadot"
            className="w-40"
            src="./images/Polkadot_Logo.png"
          />
        </div>
        <div className="flex items-center justify-center gap-4">
          <NextLink href={data.ref}>
            <Button
              className={`mt-8 px-4 py-2 text-lg font-semibold text-white rounded-lg shadow-lg ${account.address ? "hover:bg-[#BD3531] bg-[#BD3531]" : "cursor-not-allowed disabled:bg-gray-400"}`}
              type="button"
            >
              {data.title}
            </Button>
          </NextLink>
          <Button className="mt-8 px-4 py-2 text-lg font-semibold text-gray-400 bg-[#FAFAFA]">
            Start tracking
          </Button>
        </div>
      </div>
      <div className="w-full flex justify-center mt-4 bg-[#FAFAFA]">
        <img
          alt=""
          className="w-[1024px] object-contain"
          src="./images/logistics.png"
        />
      </div>
    </section>
  );
};
