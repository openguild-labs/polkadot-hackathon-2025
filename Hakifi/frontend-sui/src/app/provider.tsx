"use client";

import { Notifications } from "@/components/common/Notification";
// import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import React from "react";

const ProgressBar = dynamic(
  () => import("next-nprogress-bar").then((result) => result.AppProgressBar),
  { ssr: false }
);

import { WalletProvider } from '@suiet/wallet-kit';

import { SuiProvider } from "@/context";
import '@suiet/wallet-kit/style.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

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

      <WalletProvider
        autoConnect
      // defaultWallets={[
      //   // order defined by you
      //   SuietWallet,
      //   SuiWallet,
      //   MartianWallet,
      //   // ...
      // ]}

      >
        <SuiProvider>
          {children}
        </SuiProvider>
      </WalletProvider>

    </Notifications>
    // </ThemeProvider>
  );
}
