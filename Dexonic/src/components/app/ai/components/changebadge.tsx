import { Icons } from '@/components/common/icons';
import { Badge } from '@/components/ui/badge';

export default function ChangeBadge({ percent }: { percent: number }) {
    if (percent < 0) {
        return (
            <Badge variant="default" className="bg-red-200 text-red-600">
                <span className="flex items-center space-x-1">
                    <Icons.arrowDown className="h-4 w-4" />
                    <span>{percent.toFixed(4)}%</span>
                </span>
            </Badge>
        );
    } else {
        return (
            <Badge variant="secondary" className="bg-green-200 text-green-600">
                <span className="flex items-center space-x-1">
                    <Icons.arrowUp className="h-4 w-4" />
                    <span>{percent.toFixed(4)}%</span>
                </span>
            </Badge>
        );
    }
}
