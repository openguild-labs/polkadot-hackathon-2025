'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link';
import Image from 'next/image';

// import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Icons } from '@/components/common/icons';
import Chatbot from './components/chatbot';
// import Link from 'next/link';
// import { ReactNode } from 'react';
// import { Label } from 'recharts';

// const moreFeatures = [
//     { icon: <Icons.user className="h-6 w-6" />, name: 'Profile', href: 'profile' },
//     { icon: <Icons.circleHelp className="h-6 w-6" />, name: 'FAQ', href: 'faq' },
//     {
//         icon: <Icons.circleHelp className="h-6 w-6" />,
//         name: 'AI Assistant',
//         href: 'chatbot',
//     },
//     {
//         icon: <Icons.circleHelp className="h-6 w-6" />,
//         name: 'Community',
//         href: 'https://t.me/+iVHND1-90TAwNzA1',
//     },
// ];

export default function MorePage() {
    return (
        <div className="mx-auto flex h-full max-w-md flex-col bg-black text-white">
            {/* User Info */}
            {/* <div className="rounded-b-3xl bg-blue-600 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Profile</h1>
                        <p className="text-sm opacity-80">abcxyz97@gmail.com</p>
                    </div>
                    <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                </div>
            </div> */}

            {/* Menu Items */}
            {/* <div className="flex-grow px-6 py-8">
                {moreFeatures.map((feature, index) => {
                    const isExternal =
                        feature.href.startsWith('https://t.me/') || feature.href.startsWith('http');
                    const target = feature.href.startsWith('https://t.me/')
                        ? '_top'
                        : feature.href.startsWith('http')
                          ? '_blank'
                          : '_self';
                    return (
                        <Link
                            href={isExternal ? feature.href : `/more/${feature.href}`}
                            key={index}
                            target={target}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                        >
                            <span className="flex items-center justify-between rounded-xl p-4 text-lg font-bold duration-300 hover:bg-gray-500">
                                <h1>{feature.name}</h1>
                                {feature.icon}
                            </span>
                        </Link>
                    );
                })}
            </div> */}
            <Chatbot />
        </div>
    );
}

// function MenuItem({ icon, label, link }: { icon: ReactNode; label: string; link: string }) {
//     const tartget = link.startsWith('https://t.me/')
//         ? '_top'
//         : link.startsWith('http')
//           ? '_blank'
//           : '_self';
//     return (
//         <Link href={link} target={tartget}>
//             <div className="flex items-center justify-between py-4">
//                 <div className="flex items-center">
//                     {icon}
//                     <span className="ml-4 text-lg">{label}</span>
//                 </div>
//                 <Icons.chevronRight className="h-5 w-5 text-gray-400" />
//             </div>
//         </Link>
//     );
// }
