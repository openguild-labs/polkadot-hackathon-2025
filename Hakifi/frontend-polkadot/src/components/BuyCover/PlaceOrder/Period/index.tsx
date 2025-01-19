import { FormValue } from '@/@type/common.type';
import { PairDetail } from '@/@type/pair.type';
import colors from '@/colors';
import Button from '@/components/common/Button';
import { Drawer, DrawerContent, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger } from '@/components/common/Drawer/Base';
import FormInputDropdown from "@/components/common/FormInput/InputDropdown";
import CheckIcon from '@/components/common/Icons/CheckIcon';
import ChevronIcon from '@/components/common/Icons/ChevronIcon';
import CloseIcon from '@/components/common/Icons/CloseIcon';
import TooltipCustom from '@/components/common/Tooltip';
import { useIsTablet } from '@/hooks/useMediaQuery';
import useToggle from '@/hooks/useToggle';
import useBuyCoverStore from '@/stores/buy-cover.store';
import { cn } from '@/utils';
import { forwardRef, memo, useEffect, useMemo, useRef } from 'react';
import { UseFormSetValue } from 'react-hook-form';

type PeriodProps = Omit<{
    onChange: (value?: number | string) => void;
    errorMessage?: string;
    setValue: UseFormSetValue<FormValue>;
    pair: PairDetail;
}, "label" | "size">;

const Period = forwardRef<HTMLInputElement, PeriodProps>(
    ({ pair, setValue }, forwardRef) => {
        const { handleToggle, toggle } = useToggle();
        const onmounted = useRef(false);

        const [periodUnit, period] = useBuyCoverStore(state => [state.periodUnit, state.period]);
        const listChangeRatios = useMemo(() => {
            if (pair.config.listChangeRatios)
                return pair.config.listChangeRatios.filter((_, index) => index < 17);
            return [];
        }, [pair.config.listChangeRatios]);

        useEffect(() => {
            if (listChangeRatios.length > 0 && !onmounted.current) {
                setValue("periodUnit", listChangeRatios[1].periodUnit);
                setValue("period", listChangeRatios[1].period);

                onmounted.current = true;
            }
        }, [listChangeRatios]);

        const handleChangePeriod = (period: number, periodUnit: string) => {
            setValue("periodUnit", periodUnit);
            setValue("period", period);
            handleToggle();
        };

        const timeframe = useMemo(() => {
            return `${period} ${periodUnit}${period > 1 ? "s" : ""}`;
        }, [period, periodUnit]);

        const isTablet = useIsTablet();
        return (
            <section className="flex flex-1 items-center text-typo-secondary w-full">
                {
                    !isTablet ?
                        <FormInputDropdown
                            ref={forwardRef}
                            placeholder="Period"
                            tooltip="Margin of insurance contract. Customize margin will affect the claim amount"
                            size="lg"
                            label="Period"
                            value={<p className="lowercase">{timeframe}</p>}
                            toggle={toggle}
                            onToggle={handleToggle}
                            wrapperClassLabel="border-b border-dashed border-typo-secondary"
                            content={
                                <>
                                    {
                                        listChangeRatios.length > 0 ? listChangeRatios.map((item, index) => {
                                            return (
                                                <Button size="md" onClick={() => handleChangePeriod(item.period, item.periodUnit)} key={item.period + " - " + index} className="flex justify-between items-center p-2 hover:bg-background-secondary w-full transition-all duration-200 ease-linear">
                                                    <div className={cn("h-5 flex items-center gap-1 lowercase", item.period === period && item.periodUnit === periodUnit && "text-typo-accent")}>
                                                        <span>{item.period}</span>
                                                        <span>{item.period > 1 ? `${item.periodUnit}s` : item.periodUnit}</span>
                                                    </div>

                                                    <CheckIcon className={cn("size-4", item.period === period && item.periodUnit === periodUnit ? 'opacity-100' : 'opacity-0')} color={colors.background.primary} />
                                                </Button>
                                            );
                                        }) : null
                                    }
                                </>
                            }
                        /> :
                        <Drawer open={toggle} modal={true}>
                            <div className="flex flex-col w-full gap-y-2">
                                <section
                                    className={cn("flex w-full justify-between")}
                                >
                                    <TooltipCustom
                                        content={"Period of Insurance contract. Customize period will affect the amount of insurance payout"}
                                        titleClassName="text-typo-primary"
                                        placement={'top'}
                                        title={
                                            <div
                                                className={cn(
                                                    "border-typo-secondary border-b border-dashed",
                                                )}
                                            >
                                                Period
                                            </div>
                                        }
                                        showArrow={true}
                                    />
                                </section>
                                <DrawerTrigger asChild onClick={() => handleToggle()}>
                                    <section
                                        className={cn(
                                            "border-divider-secondary mt-2 flex w-full rounded border bg-transparent px-3 md:py-2 py-1 bg-support-black",
                                        )}
                                    >
                                        <section className="flex w-full items-center justify-between h-8">
                                            <span className="text-typo-primary lowercase">{timeframe}</span>
                                            <ChevronIcon
                                                className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
                                                color={toggle ? colors.typo.accent : colors.typo.secondary}
                                            />
                                        </section>
                                    </section>
                                </DrawerTrigger>
                            </div>
                            <DrawerPortal>
                                <DrawerOverlay className="!z-[41] bg-background-scrim" />
                            </DrawerPortal>
                            <DrawerContent onInteractOutside={() => handleToggle()} className="!z-[60]" overlay={false}>
                                <DrawerHeader>
                                    <div className="flex justify-end items-center">
                                        <CloseIcon onClick={() => handleToggle()} />
                                    </div>
                                    <DrawerTitle className="!text-title-20 text-typo-primary my-4">Period</DrawerTitle>
                                </DrawerHeader>
                                <>
                                    {
                                        listChangeRatios.length > 0 ? listChangeRatios.map((item, index) => {
                                            return (
                                                <Button size="md" onClick={() => handleChangePeriod(item.period, item.periodUnit)} key={item.period + " - " + index} className="flex justify-between items-center py-2 hover:bg-grey-2/50 w-full rounded-[10px] transition-all duration-200 ease-linear">
                                                    <div className={cn("h-5 flex items-center gap-2 lowercase", item.period === period && item.periodUnit === periodUnit && "text-typo-accent")}>
                                                        <span>{item.period}</span>
                                                        <span>{item.period > 1 ? `${item.periodUnit}s` : item.periodUnit}</span>
                                                    </div>

                                                    <CheckIcon className={cn("size-4", item.period === period && item.periodUnit === periodUnit ? 'opacity-100' : 'opacity-0')} color={colors.background.primary} />
                                                </Button>
                                            );
                                        }) : null
                                    }
                                </>

                            </DrawerContent>
                        </Drawer>
                }
            </section>
        );
    }
);

export default memo(Period);