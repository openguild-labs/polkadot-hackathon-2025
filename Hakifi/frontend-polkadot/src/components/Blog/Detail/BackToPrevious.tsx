import { FC } from 'react';

import Button from '@/components/common/Button';
import ChevronIcon from '@/components/common/Icons/ChevronIcon';
import { useRouter } from 'next/navigation';

type BackToPreviousProps = {
    className?: string;
};

const BackToPrevious: FC<BackToPreviousProps> = ({ className }) => {
    const router = useRouter();
    const handleGoBack = () => {
        router.push('/blog');
    };

    return (
        <Button size="lg" onClick={handleGoBack} className='flex items-center gap-x-2 text-typo-primary'>
            <ChevronIcon className="size-4 rotate-90" />
            <span className="text-body-16">
                Back to blog page
            </span>
        </Button>
    );
};

export default BackToPrevious;
