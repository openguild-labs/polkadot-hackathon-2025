"use client";

import { Notifications } from "@/components/common/Notification";
// import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import React from "react";
import Web3Provider from '@/web3/WagmiProvider';

const ProgressBar = dynamic(
  () => import("next-nprogress-bar").then((result) => result.AppProgressBar),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode; }) {
  return (
    // Uncomment khi làm light and dark mode
    // <ThemeProvider attribute="class">

    <Notifications>
      <ProgressBar
        height="2px"
        color="#F37B23"
        options={{ showSpinner: false }}
        shallowRouting
      />

      <Web3Provider>{children}</Web3Provider>

    </Notifications>
    // </ThemeProvider>
  );
}
