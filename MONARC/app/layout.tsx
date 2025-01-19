import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "@/components/navigation";
import { ThemeProvider } from "./providers";
import { Web3Provider } from "@/contexts/Web3Context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MONARC",
  description: "Automatic NFT Royalty Enforcement Across All Chains",
  icons: {
    icon: [
      {
        rel: 'icon',
        url: '/MONARC.jpg', // Make sure this file exists in your public folder
      },
      {
        rel: 'apple-touch-icon',
        url: '/MONARC.jpg', // For iOS devices
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/monarc-icon.jpg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Web3Provider>
            <Navigation/>
            {children}
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}