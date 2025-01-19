
import Spinner from '@/components/common/Spinner';
import { cn } from '@/utils';

const ChartLoader = ({ className }: { className?: string; }) => {
    return (
        <div className={cn("bg-background-tertiary flex items-center h-[650px] justify-center", className)}>
            <Spinner size="xs" />
        </div>
    );
};

export default ChartLoader;
