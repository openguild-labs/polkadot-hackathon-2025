"use client";

import { MarketPair } from "@/@type/pair.type";
import Button from "@/components/common/Button";
import InformationIcon from "@/components/common/Icons/InformationIcon";
import Popup from "@/components/common/Popup";
import { Skeleton } from "@/components/common/Skeleton";
import { useIsTablet } from "@/hooks/useMediaQuery";
import { Ticker, useTickerSocket } from "@/hooks/useTickerSocket";
import useToggle from "@/hooks/useToggle";
import useAppStore from "@/stores/app.store";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/format";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import ButtonPairsWrapper from "./ButtonPairsWrapper";

type InformationProps = {
    marketPairs: MarketPair[];
    symbol: string;
};


const Information = ({ marketPairs, symbol }: InformationProps) => {
    const isTablet = useIsTablet();
    const [ticker, setTicker] = useState<Ticker | null>(null);
    useTickerSocket(symbol, setTicker);
    const value: number = Number(ticker?.lastPrice) ?? 0;

    const priceChangePercent = useMemo(
        () => ticker?.priceChangePercent,
        [ticker],
    );
    const negative = useMemo(
        () => (priceChangePercent || 0) < 0,
        [priceChangePercent],
    );

    const highPrice = useMemo(
        () => ticker?.highPrice,
        [ticker],
    );
    const lowPrice = useMemo(
        () => ticker?.lowPrice,
        [ticker],
    );
    const [setStartOnboard] = useAppStore(state => [state.setStartOnboard]);
    const handleOnboard = () => {
        console.log('click')
        handleToggle(false);
        setStartOnboard(true);
    };
    const { toggle, handleToggle } = useToggle();

    const [toggleOpenTerminology] = useAppStore(state => [state.toggleOpenTerminology]);
    const handleToggleTerminologyModal = useCallback(() => {
        handleToggle(false);
        toggleOpenTerminology();
    }, []);

    return <>
        <section className="py-3 flex items-center justify-between w-full">
            {!isTablet ?
                <section className="flex items-center gap-10">

                    <ButtonPairsWrapper symbol={symbol as string} marketPairs={marketPairs} />

                    <section className="hidden sm:flex h-full items-center gap-10">
                        {
                            value ? <div className="text-title-24 text-typo-primary min-w-[100px] max-w-[160px]">{value}</div> : <Skeleton className="h-6 w-40" />
                        }

                        <div className="flex flex-col">
                            <div className="text-body-12 text-typo-secondary whitespace-nowrap">24h Change</div>
                            {priceChangePercent ?
                                <div className={cn("flex-1 !text-body-14 text-left", !negative ? "text-positive" : "text-negative",)}>
                                    {negative ? "-" : "+"}
                                    {priceChangePercent
                                        ? formatNumber(Math.abs(priceChangePercent), 2)
                                        : "-"}
                                    %
                                </div> :
                                <Skeleton className="h-5 w-[65px]" />
                            }
                        </div>
                        <div className="flex flex-col">
                            <div className="text-body-12 text-typo-secondary whitespace-nowrap">24h High</div>
                            {highPrice ?
                                <div className={cn("flex-1 !text-body-14 text-left text-typo-primary",)}>
                                    {
                                        formatNumber(highPrice, 2)
                                    }
                                </div> :
                                <Skeleton className="h-5 w-[65px]" />
                            }
                        </div>
                        <div className="flex flex-col">
                            <div className="text-body-12 text-typo-secondary whitespace-nowrap">24h Low</div>
                            {lowPrice ?
                                <div className={cn("flex-1 !text-body-14 text-left text-typo-primary",)}>
                                    {
                                        formatNumber(lowPrice, 2)
                                    }
                                </div> :
                                <Skeleton className="h-5 w-[65px]" />
                            }
                        </div>

                    </section>
                </section>
                :
                <section className="flex items-start justify-between w-full">
                    <ButtonPairsWrapper symbol={symbol as string} marketPairs={marketPairs} />

                    <section className="flex flex-col gap-3">
                        <div className="flex items-center gap-8">
                            <div className="text-body-12 text-typo-secondary w-14">24h High</div>
                            {highPrice ?
                                <div className="flex-1 text-body-12 text-left text-typo-primary">
                                    {
                                        formatNumber(highPrice, 2)
                                    }
                                </div> :
                                <Skeleton className="h-4 w-[65px]" />
                            }
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-body-12 text-typo-secondary w-14">24h Low</div>
                            {lowPrice ?
                                <div className="flex-1 text-body-12 text-left text-typo-primary">
                                    {
                                        formatNumber(lowPrice, 2)
                                    }
                                </div> :
                                <Skeleton className="h-4 w-[65px]" />
                            }
                        </div>
                    </section>

                </section>
            }

            {
                !isTablet && <Popup
                    classContent="max-w-[180px]"
                    isOpen={toggle}
                    handleOnChangeStatus={() => handleToggle()}
                    content={
                        <section className="flex flex-col items-start text-typo-secondary">
                            <Button size="md" onClick={handleOnboard} className="flex items-center hover:text-typo-accent hover:bg-background-secondary py-2 px-3 w-full ">
                                Tutorial
                            </Button>
                            <Link href={`https://docs.namiinsurance.io/tutorial/how-to-buy-nami-insurance`} target="_blank" className="hover:text-typo-accent hover:bg-background-secondary py-2 px-3 w-full text-body-12  sm:text-body-14">
                                How to buy cover
                            </Link>
                            <Button size="md" onClick={handleToggleTerminologyModal} className="flex items-center hover:text-typo-accent hover:bg-background-secondary py-2 px-3 w-full ">
                                Detail terminology
                            </Button>
                        </section>
                    }
                >

                    <Button size="md" className="flex items-center gap-1 text-typo-secondary hover:text-typo-accent">
                        Guidelines
                        <InformationIcon className="size-4" />
                    </Button>
                </Popup>
            }
        </section>

        {
            isTablet ? <section className="flex items-end justify-between py-2 border-b border-divider-secondary">
                <section className="flex items-end">
                    {
                        value ? <div className="text-title-24 text-typo-primary min-w-[100px] max-w-[160px]">{value}</div> : <Skeleton className="h-6 w-40" />
                    }
                    {priceChangePercent ?
                        <div className={cn("flex-1 !text-body-14 text-left", !negative ? "text-positive" : "text-negative",)}>
                            {negative ? "-" : "+"}
                            {priceChangePercent
                                ? formatNumber(Math.abs(priceChangePercent), 2)
                                : "-"}
                            %
                        </div> :
                        <Skeleton className="h-5 w-[65px]" />
                    }
                </section>
                <Popup
                    classContent="max-w-[180px]"
                    isOpen={toggle}
                    handleOnChangeStatus={() => handleToggle()}
                    content={
                        <section className="flex flex-col items-start text-typo-secondary">
                            <Button size="sm" onClick={handleOnboard} className="flex items-center hover:text-typo-accent hover:bg-background-secondary py-2 px-3 w-full ">
                                Tutorial
                            </Button>
                            <Link href={`https://docs.namiinsurance.io/tutorial/how-to-buy-nami-insurance`} target="_blank" className="hover:text-typo-accent hover:bg-background-secondary py-2 px-3 w-full text-body-12">
                                How to buy cover
                            </Link>
                            <Button size="sm" onClick={handleToggleTerminologyModal} className="flex items-center hover:text-typo-accent hover:bg-background-secondary py-2 px-3 w-full ">
                                Detail terminology
                            </Button>
                        </section>
                    }
                >

                    <Button size="sm" className="flex items-center gap-1 text-typo-primary">
                        Guidelines
                        <InformationIcon className="size-4" />
                    </Button>
                </Popup>
            </section> : null
        }

        {/* <Terminology /> */}
    </>;
};

export default Information;