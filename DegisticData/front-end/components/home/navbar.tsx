import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import NextLink from "next/link";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import ConnectButton from "@/script/connectWallet";

export const Navbar = () => {
  const [selectedNav, setSNav] = useState<string>("Home");

  return (
    <NextUINavbar className="bg-[#FAFAFA] pt-5" maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo height={32} width={32} />
            <p className="font-bold text-inherit">DegisticData</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex basis-3/5 sm:basis-full">
        <div className="hidden lg:flex gap-10 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NextLink key={item.href} href={item.href}>
              <button
                className={`${selectedNav == item.label ? "text-[#BD3531]" : "text-black"} font-semibold curson-pointer`}
                onClick={() => setSNav(item.label)}
              >
                {item.label}
              </button>
            </NextLink>
          ))}
        </div>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <ConnectButton />
      </NavbarContent>
    </NextUINavbar>
  );
};
