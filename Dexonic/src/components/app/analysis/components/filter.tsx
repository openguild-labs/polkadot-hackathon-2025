'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useSingleIndicatorStore } from '@/hooks/useSingleIndicatorStore';
import { cn } from '@/utils';
interface RsiFilterProps {
    className?: string;
}

export default function RsiFilter({ className }: RsiFilterProps) {
    const { time, type, setTime, setType } = useSingleIndicatorStore();

    const timeFilters = [
        { type: '5m', label: '5m' },
        { type: '30m', label: '30m' },
        { type: '1h', label: '1H' },
        { type: '4h', label: '4H' },
        { type: '1d', label: '1D' },
    ];
    const typeFilters = [
        { type: 'RSI7', label: 'RSI7' },
        { type: 'RSI14', label: 'RSI14' },
    ];

    return (
        <div className={cn(className)}>
            <div className="flex items-center justify-between space-x-2 font-bold text-white">
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-7 max-w-[10rem] bg-black">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {typeFilters.map((filter) => (
                            <SelectItem key={filter.type} value={filter.type}>
                                {filter.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="h-7 max-w-[10rem] bg-black">
                        <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                        {timeFilters.map((filter) => (
                            <SelectItem key={filter.type} value={filter.type}>
                                {filter.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
