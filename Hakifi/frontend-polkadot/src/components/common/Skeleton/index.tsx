import { cn } from "@/utils";

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded bg-typo-secondary", className)}
            {...props}
        />
    );
}

export { Skeleton };
