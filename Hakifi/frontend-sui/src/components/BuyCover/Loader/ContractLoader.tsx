
import Spinner from '@/components/common/Spinner';
import { cn } from '@/utils';

const ContractLoader = ({ className }: { className?: string; }) => {
    return (
        <div className={cn("bg-background-tertiary flex items-center h-[622px] justify-center", className)}>
            <Spinner size="xs" />
        </div>
    );
};

export default ContractLoader;
