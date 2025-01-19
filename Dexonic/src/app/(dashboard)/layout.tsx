'use client';
import BottomTab from '@/components/common/layout/bottom-tab';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/components/common/loading';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();
    const isLoading = false; // Assume no loading state without Telegram integration

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        const init = () => {
            if (typeof window !== 'undefined') {
                const localUserId = localStorage.getItem('user-id')
                    ? parseInt(localStorage.getItem('user-id')!)
                    : 0;
                if (localUserId === 0) {
                    localStorage.removeItem('user-id');
                    router.push('/');
                }
            } else {
                timer = setTimeout(init, 250);
            }
        };

        init();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [router]);

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="min-h-screen">
                    <main className="absolute bottom-16 left-0 right-0 top-0 flex-1 overflow-auto">
                        {children}
                    </main>
                    <BottomTab />
                </div>
            )}
        </>
    );
}
