import colors from "@/colors";
import { listTimeFrame } from "@/components/TVChartContainer/constantsTrading";
import Button from "@/components/common/Button";
import CheckIcon from "@/components/common/Icons/CheckIcon";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
import FullScreenIcon from "@/components/common/Icons/FullScreenIcon";
import IndicatorIcon from "@/components/common/Icons/IndicatorIcon";
import MinimizeIcon from "@/components/common/Icons/MinimizeIcon";
import RefreshIcon from "@/components/common/Icons/RefreshIcon";
import Popup from "@/components/common/Popup";
import { Tabs, TabsList, TabsTrigger } from "@/components/common/Tabs";
import { useIsTablet } from "@/hooks/useMediaQuery";
import useToggle from "@/hooks/useToggle";
import { cn } from "@/utils";
import { useMemo } from "react";

type ChartOptionsProps = {
    mode: string;
    resolution: string;
    setResolution: (value: string) => void;
    setMode: (e: string) => void;
    fullScreen: boolean;
    setFullScreen: (e: boolean) => void;
    onShowIndicator: VoidFunction;
    onRefreshChart: VoidFunction;
};

interface Resolution {
    label: string;
    resolution: string,
}

const ChartOptions = ({ onRefreshChart, resolution, setResolution, mode, setMode, fullScreen, setFullScreen, onShowIndicator }: ChartOptionsProps) => {
    const isTablet = useIsTablet();
    const frames = useMemo(() => {
        if (isTablet) {
            return listTimeFrame.filter((item, index) => index < 4);
        }
        return listTimeFrame;
    }, [isTablet]);
    const { handleToggle, toggle } = useToggle();
    return (
        <div
            className="w-full flex items-center justify-between gap-3 sm:gap-0 bg-background-tertiary"
        >

            <div className="flex items-center md:min-w-[250px] gap-2">
                <Tabs className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-2">
                        {frames.map((t: Resolution, index: number) => {
                            return <TabsTrigger
                                key={t.resolution}
                                value={t.resolution}
                                onClick={() => setResolution(t.resolution)}
                                className={cn("!text-body-12  hover:bg-background-secondary hover:text-typo-accent hover:border-divider-primary h-6 w-8 text-typo-secondary border border-divider-secondary rounded-sm",
                                    t.resolution === resolution && "!text-body-14 bg-background-secondary text-typo-accent border-divider-primary")}>
                                {t.label}
                            </TabsTrigger>;
                        }
                        )}
                    </TabsList>
                </Tabs>
                {isTablet && <Popup
                    classContent="max-w-[180px]"
                    isOpen={toggle}
                    handleOnChangeStatus={() => handleToggle()}
                    content={
                        <>
                            {
                                listTimeFrame.filter((_, index) => index > 3).map((item, index) => {
                                    return (
                                        <Button size="sm" onClick={() => setResolution(item.resolution)} key={item.label + " - " + index} className="flex gap-2 items-center p-2 hover:bg-grey-2/50 w-full rounded-[10px] transition-all duration-200 ease-linear">
                                            <div className={cn("h-5 flex items-center gap-1 text-body-12 lowercase", item.resolution === resolution && "text-typo-accent")}>
                                                {item.label}
                                            </div>

                                            <CheckIcon className={cn("size-4", item.resolution === resolution ? 'opacity-100' : 'opacity-0')} color={colors.background.primary} />
                                        </Button>
                                    );
                                })
                            }
                        </>
                    }
                >
                    <Button size="md" variant="outline" point={false} className="flex items-center gap-1 !p-1 !rounded-sm">
                        <ChevronIcon
                            className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
                            color={toggle ? colors.typo.accent : colors.typo.secondary}
                        />
                    </Button>
                </Popup>}
            </div>
            <div className="flex items-center space-x-3">
                {/* <p className="text-body-14 text-typo-accent">Trading view</p> */}
                {!isTablet && (
                    <>
                        <div className="cursor-pointer" onClick={() => setFullScreen(!fullScreen)}>
                            {
                                !fullScreen ? <FullScreenIcon className="[&>path]:hover:fill-typo-accent" /> : <MinimizeIcon className="[&>path]:hover:fill-typo-accent" />
                            }
                        </div>
                        <div className="cursor-pointer" onClick={onShowIndicator}>
                            <IndicatorIcon className="[&>path]:hover:fill-typo-accent" />
                        </div>
                    </>
                )}
                {
                    !isTablet && <Button size="md" className="" onClick={onRefreshChart}>
                        <RefreshIcon className="[&>path]:hover:fill-typo-accent" />
                    </Button>
                }
            </div>
        </div>
    );
};

export default ChartOptions;
