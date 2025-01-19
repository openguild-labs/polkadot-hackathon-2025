
import { Skeleton } from '@/components/common/Skeleton';
import { cn } from '@/utils';

const FavoritesLoader = ({ className }: { className?: string; }) => {
    return (
        <div className={cn("bg-background-tertiary flex items-center h-[62.4px]", className)}>
            <div className="flex items-center gap-2  px-4 py-3">
                <Skeleton className="rounded size-[19px]" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="rounded h-4 w-16" />
                    <Skeleton className="rounded h-4 w-32" />
                </div>
            </div>
            <div className="flex items-center gap-2  px-4 py-3">
                <Skeleton className="rounded size-[19px]" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="rounded h-4 w-16" />
                    <Skeleton className="rounded h-4 w-32" />
                </div>
            </div>
            <div className="flex items-center gap-2  px-4 py-3">
                <Skeleton className="rounded size-[19px]" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="rounded h-4 w-16" />
                    <Skeleton className="rounded h-4 w-32" />
                </div>
            </div>
            <div className="flex items-center gap-2  px-4 py-3">
                <Skeleton className="rounded size-[19px]" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="rounded h-4 w-16" />
                    <Skeleton className="rounded h-4 w-32" />
                </div>
            </div>
        </div>
    );
};

export default FavoritesLoader;
