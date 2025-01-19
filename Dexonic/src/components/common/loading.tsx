import { cn } from '@/utils';
import { Icons } from './icons';

export default function Loading() {
    return (
        <div className="grid h-screen place-content-center px-4">
            <Icons.loader2 className={cn('my-28 h-16 w-16 animate-spin text-primary/60')} />
        </div>
    );
}
