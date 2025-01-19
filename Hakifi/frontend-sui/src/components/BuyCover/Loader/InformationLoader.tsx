
import { Skeleton } from '@/components/common/Skeleton';
import { cn } from '@/utils';

const InformationLoader = ({ className }: { className?: string; }) => {
    return (
        <div className={cn("bg-background-tertiary flex items-center h-[78.4px]", className)}>
            <Skeleton className="rounded h-[54.4px] w-40" />
            <div className="flex items-center gap-2 px-4 py-3">
                <div className="flex flex-col gap-2">
                    <Skeleton className="rounded h-4 w-16" />
                    <Skeleton className="rounded h-4 w-32" />
                </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3">
                <div className="flex flex-col gap-2">
                    <Skeleton className="rounded h-4 w-16" />
                    <Skeleton className="rounded h-4 w-32" />
                </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3">
                <div className="flex flex-col gap-2">
                    <Skeleton className="rounded h-4 w-16" />
                    <Skeleton className="rounded h-4 w-32" />
                </div>
            </div>
        </div>
    );
};

export default InformationLoader;
