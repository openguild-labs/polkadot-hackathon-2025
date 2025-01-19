'use client';
import { Area, AreaChart } from 'recharts';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { isNil } from 'lodash';
export function AreaGraph({ data }: { data: number[] }) {
    if (isNil(data) || data.length <= 0) return null;
    const chartData = data.map((price: number, index: number) => ({
        index,
        price: price - data[0] * 0.95,
    }));
    const chartColor = data[0] > data[data.length - 1] ? '#ff0000' : '#009933';
    const chartConfig = {
        price: {
            label: 'price',
        },
    } satisfies ChartConfig;
    return (
        <ChartContainer config={chartConfig} className="h-10 w-full">
            <AreaChart accessibilityLayer data={chartData}>
                <Area
                    dataKey="price"
                    type="natural"
                    fill={chartColor}
                    fillOpacity={0.4}
                    stroke={chartColor}
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    );
}
