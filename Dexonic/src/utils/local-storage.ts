import { localStorageTTL } from '@/constants/app.constants';

class LocalStorage {
    private ttl: number;

    constructor(ttl: number) {
        this.ttl = ttl;
    }

    getItem(key: string) {
        const item = localStorage.getItem(key);
        if (!item) return null;

        const parsedItem = JSON.parse(item);
        const { expiration, ...data } = parsedItem;

        if (Date.now() > expiration) {
            localStorage.removeItem(key);
            return null;
        }

        return data;
    }

    setItem(key: string, data: unknown) {
        const expiration = Date.now() + this.ttl;
        const item = JSON.stringify({ ...(data as object), expiration });
        localStorage.setItem(key, item);
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }
}

export const appLocalStorage = new LocalStorage(localStorageTTL); // 1 hour TTL
