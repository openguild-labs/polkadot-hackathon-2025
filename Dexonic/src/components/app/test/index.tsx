'use client';

import { useTelegram } from '@/contexts/telegram';

export function TestPage() {
    const { tg } = useTelegram();
    return JSON.stringify(tg);
}
