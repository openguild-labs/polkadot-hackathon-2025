'use client';

import { useState } from 'react';

import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useIsMobile } from '@/hooks/use-mobile';

// Menu items.
const items = [
    {
        title: 'AI Assistant',
        url: '#',
        icon: Home,
    },
    {
        title: 'Community',
        url: '#',
        icon: Inbox,
    },
    {
        title: 'Document',
        url: '#',
        icon: Calendar,
    },
    {
        title: 'Premium',
        url: '#',
        icon: Search,
    },
    {
        title: 'Language',
        url: '#',
        icon: Settings,
    },
    {
        title: 'FAQ',
        url: '#',
        icon: Settings,
    },
];

export function AppSidebar() {
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`absolute top-1/2 z-50 h-40 -translate-y-1/2 transform rounded-md bg-blue-600 p-2 text-white transition-all duration-300 ${isOpen ? 'right-64' : 'right-0'}`}
            >
                {isOpen ? '' : ''}
            </button>
            <div
                className={`fixed z-[9998] transition-all duration-300 ${isOpen ? 'right-0' : '-right-64'} h-screen w-64 text-white`}
                style={!isMobile ? { top: '50%', transform: 'translateY(-50%)' } : {}}
            >
                <Sidebar>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Application</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton>
                                                <a
                                                    href={item.url}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
            </div>

            {isMobile && isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed right-0 top-0 z-[9998] h-full w-full bg-black/50"
                ></div>
            )}
        </div>
    );
}
