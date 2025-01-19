import { cn } from "@/utils";
import { useMemo } from "react";

type PaginationProps = {
    total: number;
    page: number;
    limit?: number;
    className?: string;
};

const Pagination = ({ total, page, limit = 4, className }: PaginationProps) => {
    const totalPage = useMemo(() => Math.ceil(total / limit), [total, limit]);
    const renderDots = () => {
        const dot = [];
        for (let i = 0; i < totalPage; i++) {
            dot.push(<div key={i} className={cn('size-[6px] bg-divider-secondary rounded-[1px] transition-all', { '!w-9 !bg-background-primary': i === page })} />);
        }
        return dot;
    };

    return totalPage > 1 && <div className={cn("flex items-center justify-center gap-3", className)}>{renderDots()}</div>;

};

export default Pagination;