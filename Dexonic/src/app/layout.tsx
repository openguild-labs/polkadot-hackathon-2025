import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
// import { DM_Sans as FontSans } from 'next/font/google';
import { Sofia_Sans } from 'next/font/google';
import Script from 'next/script';
import { cn } from '@/utils';
import Providers from '@/components/common/provider';
import { appConfig } from '@/constants/app.constants';
import { GoogleAnalytics } from '@next/third-parties/google';
import { isNil } from 'lodash';
// import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// import { AppSidebar } from '@/components/common/layout/app-sidebar';

declare global {
    interface Window {
        Telegram: Telegram;
    }
}

// const fontSans = FontSans({
//     subsets: ['latin'],
//     weight: ['400', '500', '700'],
//     variable: '--font-sans',
// });

const sofiaSans = Sofia_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--sofia-sans',
});

export const metadata: Metadata = {
    title: appConfig.title,
    description: appConfig.description,
};
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            {/* `block md:hidden` */}
            <body className={cn(sofiaSans.variable)}>
                <Script src="https://telegram.org/js/telegram-web-app.js" defer />
                {!isNil(appConfig.gaid) && appConfig.gaid.trim() !== '' && (
                    <GoogleAnalytics gaId={appConfig.gaid} />
                )}
                <Providers>{children}</Providers>
                {/* <SidebarProvider>
                    <AppSidebar />
                    <main className="">
                        <SidebarTrigger />
                        {children}
                    </main>
                </SidebarProvider> */}
            </body>
        </html>
    );
}
