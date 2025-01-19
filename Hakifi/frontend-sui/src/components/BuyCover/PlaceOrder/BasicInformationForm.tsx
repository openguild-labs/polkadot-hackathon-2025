import { FormValue } from '@/@type/common.type';
import { PairDetail } from '@/@type/pair.type';
import colors from '@/colors';
import Button from '@/components/common/Button';
import { Drawer, DrawerContent, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger } from '@/components/common/Drawer/Base';
import CheckIcon from '@/components/common/Icons/CheckIcon';
import ChevronIcon from '@/components/common/Icons/ChevronIcon';
import CloseIcon from '@/components/common/Icons/CloseIcon';
import Popup from '@/components/common/Popup';
import TooltipCustom from '@/components/common/Tooltip';
import useBalance from '@/hooks/useBalance';
import { useIsTablet } from '@/hooks/useMediaQuery';
import useToggle from '@/hooks/useToggle';
import useBuyCoverStore from '@/stores/buy-cover.store';
import { cn } from '@/utils';
import { formatNumber } from '@/utils/format';
import { useEffect, useMemo, useRef } from 'react';
import { UseFormSetValue } from 'react-hook-form';

type BasicInformationFormProps = {
    pair: PairDetail;
    setValue: UseFormSetValue<FormValue>;
};

const BasicInformationForm = ({ pair, setValue }: BasicInformationFormProps) => {
    const { handleToggle, toggle } = useToggle();
    const onmounted = useRef(false);

    const { balance: usdtBalance } = useBalance();

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

    const isTablet = useIsTablet();
    return (
        <section className="text-body-14 flex items-center justify-between">
            <section className="text-typo-secondary">Available: <span className="text-typo-primary"> {formatNumber(usdtBalance)} USDT</span>
            </section>
            <section className="flex items-center text-typo-secondary gap-2">
                <TooltipCustom
                    content="The duration of your insurance contract. Setting the period will affect your claim amount"
                    titleClassName="!text-typo-secondary"
                    title={
                        <p className="text-body-14">
                            Period:
                        </p>
                    }
                    showArrow={true}
                />
                {
                    !isTablet ? <Popup
                        classContent="max-w-[180px] max-h-[200px]"
                        isOpen={toggle}
                        handleOnChangeStatus={() => handleToggle()}
                        content={
                            <>
                                {
                                    listChangeRatios.length > 0 ? listChangeRatios.map((item, index) => {
                                        return (
                                            <Button size="sm" onClick={() => handleChangePeriod(item.period, item.periodUnit)} key={item.period + " - " + index} className="flex gap-2 items-center p-2 hover:bg-background-secondary w-full transition-all duration-200 ease-linear">
                                                <div className={cn("h-5 flex items-center gap-1 text-body-12 lowercase", item.period === period && item.periodUnit === periodUnit && "text-typo-accent")}>
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
                    >
                        <Button size="sm" variant="outline" point={false} className="flex items-center gap-1 !py-1 !px-2 !rounded-sm">
                            <span className={cn("lowercase", toggle ? "text-typo-accent" : "!text-typo-primary")}> {period} {periodUnit}</span>
                            <ChevronIcon
                                className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
                                color={toggle ? colors.typo.accent : colors.typo.secondary}
                            />
                        </Button>
                    </Popup> :
                        <Drawer open={toggle} modal={true}>
                            <DrawerTrigger asChild onClick={() => handleToggle()}>
                                <Button size="sm" variant="outline" point={false} className="flex items-center gap-1 !py-1 !px-2 !rounded-sm">
                                    <span className={cn("lowercase", toggle ? "text-typo-accent" : "text-typo-primary")}> {period} {periodUnit}</span>
                                    <ChevronIcon
                                        className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
                                        color={toggle ? colors.typo.accent : colors.typo.secondary}
                                    />
                                </Button>
                            </DrawerTrigger>
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
        </section>
    );
};

export default BasicInformationForm;