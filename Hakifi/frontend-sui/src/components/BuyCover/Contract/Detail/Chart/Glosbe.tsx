import { IPairConfig } from "@/@type/insurance.type";
import { InsuranceChartParams, useDrawing } from "@/components/BuyCover/Chart/drawing";
import { useChart } from "@/components/TVChartContainer";
import IndicatorBars from "@/components/TVChartContainer/IndicatorBars";
import { useIsTablet } from "@/hooks/useMediaQuery";
import { cn } from "@/utils";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import ChartOptions from "./ChartOptions";

type GlosbeProps = {
    symbol: string;
    decimals?: { symbol: number; price: number; };
    isMobile?: boolean;
    pairConfig?: IPairConfig;
    isDetail?: boolean;
    isHistory?: boolean;
    onFullScreen: (e: boolean) => void;
    showTimeframe?: boolean;
    className?: string;
    customClassName?: string;
    classContainer?: string;
    toolbar?: boolean;
    fullScreen: boolean;
    data: InsuranceChartParams;
};

const Glosbe = ({
    symbol,
    isDetail = false,
    onFullScreen,
    showTimeframe = true,
    className = "",
    classContainer,
    customClassName,
    fullScreen,
    data
}: GlosbeProps) => {
    const isTable = useIsTablet();
    const [mode, setMode] = useState("trading");
    const {
        containerRef,
        container_id,
        chartReady,
        chart,
        widget,
        setIntervalChart,
        handleChangeIndicator,
        indicator
    } = useChart(symbol, true);

    const { drawing, clearLine } = useDrawing(chart, chartReady, data);

    const [resolution, setResolution] = useState("1D");

    const handleChangeResolution = (value: string) => {
        setIntervalChart(value);
        setResolution(value);
    };

    const onRefreshChart = () => {
        clearLine();
        debounce(() => {
            drawing();
        }, 500);
    };

    const onShowIndicator = () => {
        widget?.activeChart().executeActionById("insertIndicator");
    };

    const offsetH = useMemo(() => {
        if (fullScreen && isTable) return 'calc(100dvw - 88px)';
        if (fullScreen) return `calc(100dvh - 204px)`;
        if (isTable) return 420;

        return `calc(100dvh - 203px)`;
    }, [fullScreen, isTable]);

    useEffect(() => {
        document.body
            .querySelector('main')
            ?.classList[fullScreen ? 'add' : 'remove']('hidden');

        return () => {
            document.body.querySelector('main')?.classList.remove('hidden');
        };
    }, [fullScreen]);

    return (
        <>
            <section className={cn("py-3 border-b border-divider-secondary bg-background-tertiary",
                !isTable && "border-t pr-5"
            )}>
                <ChartOptions
                    mode={mode}
                    resolution={resolution}
                    setResolution={handleChangeResolution}
                    setMode={setMode}
                    fullScreen={fullScreen}
                    setFullScreen={onFullScreen}
                    onShowIndicator={onShowIndicator}
                    onRefreshChart={onRefreshChart}
                />
            </section>

            <div
                style={{
                    height: offsetH,
                }}
                className={cn("bg-background-tertiary", "duration-300 transition-all ease-linear", className)}>
                <div className="h-full ">
                    <div
                        ref={containerRef as React.RefObject<HTMLDivElement>}
                        id={container_id as string}
                        className={cn(customClassName, "h-full border-b border-divider-secondary")}
                    />
                    {
                        isTable && <IndicatorBars
                            onChangeIndicator={handleChangeIndicator}
                            mainIndicator={indicator.mainIndicator?.name}
                            subIndicator={indicator.subIndicator?.name}
                            fullScreen={fullScreen}
                            setFullScreen={onFullScreen}
                            onShowIndicator={onShowIndicator}
                            isDetail={isDetail}
                            isMobile={isTable}
                            onRefreshChart={onRefreshChart}
                        />
                    }
                </div>
            </div>
        </>
    );
};

export default Glosbe;