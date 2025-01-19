/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Loading from '@/components/common/loading';
import { cn } from '@/utils';
import { getHeatmapChartData } from '@/services/single-indicator';
import { useSingleIndicatorStore } from '@/hooks/useSingleIndicatorStore';
import { HeatMapData } from '@/types/single-indicator';
// import { color } from 'framer-motion';
// import { X } from 'lucide-react';

interface EChartComponentProps {
    className?: string;
}

export const HeatMapChart = ({ className }: EChartComponentProps) => {
    const { type, time } = useSingleIndicatorStore();
    const [heatMapData, setHeatMapData] = useState<[number, number][]>([]);
    const [nameCoins, setNameCoins] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const averageRSI = useMemo(() => {
        if (heatMapData.length === 0) {
            return 0; // Hoặc giá trị mặc định khác nếu data rỗng
        }
        const totalRSI = heatMapData.reduce((sum, item) => sum + item[1], 0); // Tính tổng RSI
        return totalRSI / heatMapData.length; // Tính trung bình
    }, [heatMapData]); // Chỉ tính toán lại khi data thay đổi

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const chartData: HeatMapData[] = await getHeatmapChartData(type, time);
                setNameCoins(chartData.map((item: HeatMapData) => item.symbol));
                setHeatMapData(
                    chartData.map((item: HeatMapData, index: number) => [index, item.rsi]),
                );
            } catch {
                setHeatMapData([]);
                setNameCoins([]);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [type, time]);

    const option = {
        color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
                {
                    offset: 0,
                    color: 'red', // color at 0% position
                },
                {
                    offset: 1,
                    color: 'blue', // color at 100% position
                },
            ],
            global: false, // false by default
        },
        dataZoom: [
            {
                type: 'slider', // Hoặc 'slider' nếu bạn muốn thanh trượt dataZoom
                xAxisIndex: [0], // Chỉ định trục xAxis áp dụng dataZoom
                start: 20, // Phần trăm bắt đầu hiển thị (0 = 0%)
                end: 50, // Phần trăm kết thúc hiển thị (100 = 100%)
                // zoomLock: true,
                realtime: false,
                right: 13,
            },
        ],
        grid: {
            z: 4,
            left: '12%',
            right: 10,
            top: 20,
            bottom: 55,
        },
        tooltip: {
            show: true,
            formatter: function (params: any) {
                return `<div>${params.name}<br />RSI: ${params.value[1]}</div>`;
            },
        },
        xAxis: {
            name: '',
            nameLocation: 'middle',
            nameTextStyle: {
                padding: 0,
            },
            type: 'category',
            axisLabel: {
                color: '#33333',
                inside: false,
                showMaxLabel: false,
                showMinLabel: false,
            },
            data: nameCoins.map(() => ''),
            // min: 0,
            // max: nameCoins.length,
            interval: 20,
        },
        yAxis: {
            name: 'RSI(4h)',
            nameLocation: 'middle',
            nameTextStyle: {
                padding: 20,
            },
            axisLabel: {
                inside: false,
                showMaxLabel: true,
                showMinLabel: true,
                color: function (value: number) {
                    return value >= 80 && value <= 100
                        ? '#FC454A'
                        : value >= 70 && value < 80
                          ? 'orange'
                          : value >= 50 && value < 70
                            ? 'white'
                            : value >= 40 && value < 60
                              ? '#79DFC7'
                              : '#00D0A6';
                },
            },
            min: 10,
            max: 100,
            interval: 10,
        },
        series: [
            {
                data: heatMapData?.map((item, index) => {
                    if (!nameCoins) return null;
                    let symbol = `image:///_next/image?url=https://bin.bnbstatic.com/static/assets/logos/${nameCoins[index].slice(0, -4)}.png&w=64&q=100`;
                    if (nameCoins[index].slice(0, -4) == 'SOL')
                        symbol = `image:///_next/image?url=https://i.imgur.com/nei4mu7.png&w=64&q=100`;
                    if (nameCoins[index].slice(0, -4) == 'DOT')
                        symbol = `image:///_next/image?url=https://i.imgur.com/MzQMz9o.png&w=64&q=100`;
                    if (nameCoins[index].slice(0, -4) == 'ALGO')
                        symbol = `image:///_next/image?url=https://i.imgur.com/1RInkxJ.png&w=64&q=100`;
                    return {
                        symbol: symbol,
                        value: item,
                        name: nameCoins[index],
                        symbolSize: 24,
                    };
                }),
                z: 5,
                itemStyle: {
                    opacity: 1,
                },

                markArea: {
                    silent: true,
                    label: {
                        show: true,
                        fontSize: 12,
                        color: '#90959e',
                        position: 'insideLeft',
                    },

                    emphasis: {
                        disabled: true,
                    },
                    data: [
                        [
                            {
                                name: 'OVERSOLD',
                                yAxis: 0,
                                label: {
                                    show: true,
                                    fontSize: 12,
                                    color: '#17bf88',
                                    position: 'insideLeft',
                                },
                                itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [
                                            { offset: 0, color: '#03403C' },
                                            { offset: 1, color: '#026D6B' },
                                        ],
                                    },
                                    borderWidth: 0,
                                    borderColor: '#ffffff',
                                },
                            },
                            {
                                yAxis: 30,
                            },
                        ],
                        [
                            {
                                name: 'WEAK',
                                yAxis: 30,
                                label: {
                                    show: true,
                                    fontSize: 12,
                                    color: '#17bf88',
                                    position: 'insideLeft',
                                },
                                itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [
                                            { offset: 0, color: '#01100F' },
                                            { offset: 1, color: '#03403C' },
                                        ],
                                    },
                                    borderWidth: 0,
                                    borderColor: '#ffffff',
                                },
                            },
                            {
                                yAxis: 40,
                            },
                        ],
                        [
                            {
                                name: 'NEUTRAL',
                                yAxis: 40,
                                label: {
                                    show: true,
                                    fontSize: 12,
                                    color: '#b1cdff',
                                    position: 'insideLeft',
                                },
                                itemStyle: {
                                    borderWidth: 0,
                                    borderColor: '#ffffff',
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [
                                            { offset: 0, color: '#000' },
                                            { offset: 1, color: '#01100F' },
                                        ],
                                    },
                                },
                            },
                            {
                                yAxis: 60,
                            },
                        ],
                        [
                            {
                                name: 'STRONG',
                                yAxis: 60,
                                label: {
                                    show: true,
                                    fontSize: 12,
                                    color: '#e7a4a3',
                                    position: 'insideLeft',
                                },
                                itemStyle: {
                                    color: '#000',
                                    borderWidth: 0,
                                    borderColor: '#ffffff',
                                },
                            },
                            {
                                yAxis: 70,
                            },
                        ],
                        [
                            {
                                name: 'OVERBOUGHT',
                                yAxis: 70,
                                label: {
                                    show: true,
                                    fontSize: 12,
                                    color: {},
                                    position: 'insideLeft',
                                },
                                itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1, // Gradient direction (top to bottom)
                                        colorStops: [
                                            { offset: 0, color: '#710202' }, // Light red at the top
                                            { offset: 1, color: '#000' }, // Lighter red at the bottom
                                        ],
                                    },
                                    // opacity: 0.5,
                                    borderWidth: 0,
                                    borderColor: '#ffffff',
                                },
                                lineStyle: {
                                    borderType: 'solid',
                                    color: '#ffffff',
                                    width: 2,
                                },
                            },
                            {
                                yAxis: 100,
                                lineStyle: {
                                    borderType: 'solid',
                                    color: '#f56866', // Bottom border color
                                    width: 2,
                                },
                            },
                        ],
                    ],
                },
                type: 'scatter',
                // markLine: {
                //     silent: true,
                //     symbol: ['none', 'none'],
                //     label: {
                //         show: true,
                //         position: 'insideEndTop',
                //         formatter: 'AVG RSI: {c}',
                //         color: 'rgb(234,151,62)',
                //         fontSize: 12,
                //         // distance: [30, 10],
                //     },
                //     lineStyle: {
                //         type: 'dashed',
                //         color: 'rgb(234,151,62)',
                //         width: 1,
                //     },
                //     data: [{ yAxis: averageRSI }],
                //     z: 0,
                // },
                markLine: {
                    silent: true,
                    symbol: ['none', 'none'],
                    label: {
                        show: false,
                    },
                    data: [
                        {
                            yAxis: 100,
                            lineStyle: {
                                color: '#A30203',
                                width: 2,
                                type: 'solid',
                            },
                        },
                        {
                            yAxis: 70,
                            lineStyle: {
                                color: '#980204',
                                width: 2,
                                type: 'solid',
                            },
                        },
                        {
                            yAxis: 60,
                            lineStyle: {
                                color: '#8F0204',
                                width: 1,
                                type: 'solid',
                            },
                        },
                        {
                            yAxis: 40,
                            lineStyle: {
                                color: '#017B7B',
                                width: 1,
                                type: 'solid',
                            },
                        },
                        {
                            yAxis: 30,
                            lineStyle: {
                                color: '#01BABA',
                                width: 2,
                                type: 'solid',
                            },
                        },
                        {
                            yAxis: 10,
                            lineStyle: {
                                color: '#02BABA',
                                width: 2,
                                type: 'solid',
                            },
                        },
                    ],
                },
            },
        ],
    };

    return (
        <div className="w-full">
            {isLoading ? (
                <Loading />
            ) : (
                <ReactECharts
                    option={option}
                    style={{ height: '604px', width: '100%' }}
                    className={cn(className)}
                />
            )}
        </div>
    );
};
