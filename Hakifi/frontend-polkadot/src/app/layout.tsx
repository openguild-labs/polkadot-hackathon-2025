import Auth from "@/components/auth/Auth";
import Layout from "@/components/layout";
import { determinationFont, sairaFont } from "@/configs/fonts";
import { cn } from "@/utils";
import dynamic from "next/dynamic";
import { Providers } from "./provider";

import { GA_TRACKING_ID } from "@/configs/analytics";
import { GoogleAnalytics } from '@next/third-parties/google';

import './globals.css';

const ConnectWalletModal = dynamic(() => import('@/components/ConnectWalletModal'), {
  ssr: false,
});

const NetworkModal = dynamic(() => import('@/components/auth/NetworkModal'), {
  ssr: false,
});

export const generateMetadata = () => {
  return {
    description: ('Hakifi is a hedging protocol to provide insurance solutions that protects users assets from market fluctuations. Users can easily choose digital assets and receive personalized suggestions for opening an insurance contract with Hakifi. Currently, the supported insurance coverage list includes over 150 listed assets.'),
    title: "Hakifi | The first asset value insurance protocol using Blockchain technology",
    icon: {
      url: "/favicon.ico",
    }
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        sairaFont.variable,
        determinationFont.variable,
        "font-saira text-support-white bg-background-tertiary"
      )}>
        <Providers>
          <NetworkModal />
          <ConnectWalletModal />
          <Auth />
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
      {GA_TRACKING_ID && <GoogleAnalytics gaId={GA_TRACKING_ID} />}
    </html>
  );
}
