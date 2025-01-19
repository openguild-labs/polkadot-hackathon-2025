// import { tabMenu } from '@/constants/app.constants';
import { cn } from '@/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { tabMenu } from '@/constants/app.constants';
import classes from './bottom-tab.module.css';

import swapBtn from '@/public/icons/bottom-tab/swap-btn.svg';
// import { omit } from 'lodash';

export default function BottomTab() {
    const pathname = usePathname();
    const activeRoute = useCallback(
        (routeName: string) => {
            if (routeName === '/') {
                return pathname === '/';
            } else {
                return pathname?.includes(routeName);
            }
        },
        [pathname],
    );
    return (
        <>
            <div className="border-1 fixed bottom-0 left-0 right-0 z-[9999] h-16 w-full rounded-t-3xl border bg-black">
                <div className="mx-auto flex h-10 max-w-lg">
                    {tabMenu.map((tab) => (
                        <Link
                            href={tab.link}
                            key={tab.id}
                            className={cn(
                                'relative flex h-16 w-full flex-col items-center justify-center gap-1 border-b-4 border-transparent text-xs transition-all duration-300 ease-in-out',
                                activeRoute(tab.link)
                                    ? `${classes.activeRoute}`
                                    : 'text-muted-foreground',
                            )}
                            // style={{
                            //     background: activeRoute(tab.link)
                            //         ? 'linear-gradient(0deg, #cce6ff, white)'
                            //         : 'none',
                            // }}
                            prefetch={false}
                        >
                            <Image
                                src={tab.icon}
                                alt={tab.label}
                                className={
                                    (cn('h-6 w-6'), tab.icon === swapBtn ? 'mb-10 h-20 w-20' : '')
                                }
                            />
                            <span
                                className={cn(
                                    'text-xs font-medium',
                                    // activeRoute(tab.link) ? 'text-white' : '',
                                )}
                            >
                                {tab.label}
                            </span>
                            {activeRoute(tab.link) && (
                                <motion.div
                                    className="absolute inset-0 rounded-b-md"
                                    layoutId="activeTab"
                                    initial={false}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
