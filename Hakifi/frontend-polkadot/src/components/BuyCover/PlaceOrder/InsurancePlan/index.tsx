import { FormValue } from '@/@type/common.type';
import { InsurancePlan } from '@/@type/insurance.type';
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
import useInsuranceStore from '@/stores/insurance.store';
import { cn } from '@/utils';
import { forwardRef, memo, useCallback, useMemo } from 'react';
import { UseFormSetValue } from 'react-hook-form';

type InsurancePlanProps = Omit<{
    onChange: (value?: number) => void;
    errorMessage?: string;
    setValue: UseFormSetValue<FormValue>;
}, "label" | "size">;

const InsurancePlanInput = forwardRef<HTMLInputElement, InsurancePlanProps>(
    ({ setValue, onChange }, forwardRef) => {
        const { handleToggle, toggle } = useToggle();
        const { plans } = useInsuranceStore();
        const { plan } = useBuyCoverStore();

        const handleChangePlan = useCallback((plan: InsurancePlan) => {
            onChange(plan.id);
            const margin = plan.id === 1 ? 100 : plan.min_margin;
            setValue("margin", margin);
            handleToggle();
        }, []);

        const selected = useMemo(() => {
            return plans.find(item => item.id === plan); // -1 because index start from 0, and plan start from 1
        }, [plan, plans]);

        const isTablet = useIsTablet();
        return (
            <section className="flex flex-1 items-center text-typo-secondary w-full">
                {
                    !isTablet ?
                        <FormInputDropdown
                            ref={forwardRef}
                            placeholder="Insurance plan"
                            tooltip="Select the appropriate insurance plan that aligns with the value of the assets you wish to protect"
                            size="lg"
                            label="Insurance plan"
                            value={<>{selected?.name}</>}
                            align="start"
                            toggle={toggle}
                            onToggle={handleToggle}
                            wrapperClassLabel="border-b border-dashed border-typo-secondary"
                            content={
                                <div className="flex flex-col gap-y-1">
                                    {
                                        plans.length > 0 ? plans.map((item, index) => {
                                            return (
                                                <Button size="md" onClick={() => handleChangePlan(item)} key={item.id + " - " + index} className="flex justify-between items-center px-2 py-3 hover:bg-background-secondary w-full transition-all duration-200 ease-linear">
                                                    <div className={cn("h-5 flex items-center gap-1", item.id === plan && "text-typo-accent")}>
                                                        <span>{item.name} ({item.min_q_cover} - {item.max_q_cover})</span>
                                                    </div>

                                                    <CheckIcon className={cn("size-4", item.id === plan ? 'opacity-100' : 'opacity-0')} color={colors.background.primary} />
                                                </Button>
                                            );
                                        }) : null
                                    }
                                </div>
                            }
                        />
                        :
                        <Drawer open={toggle} modal={true}>
                            <div className="flex flex-col w-full gap-y-2">
                                <section
                                    className={cn("flex w-full justify-between")}
                                >
                                    <TooltipCustom
                                        content={"Select the appropriate insurance plan that aligns with the value of the assets you wish to protect"}
                                        titleClassName="text-typo-primary"
                                        placement={'top'}
                                        title={
                                            <div
                                                className={cn(
                                                    "border-typo-secondary border-b border-dashed",
                                                )}
                                            >
                                                Insurance plan
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
                                            <span className="text-typo-primary">{plans[plan - 1].name}</span>
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
                                    <DrawerTitle className="!text-title-20 text-typo-primary my-4">Insurance plan</DrawerTitle>
                                </DrawerHeader>
                                <>
                                    {
                                        plans.length > 0 ? plans.map((item, index) => {
                                            return (
                                                <Button size="md" onClick={() => handleChangePlan(item)} key={item.id + " - " + index} className="flex justify-between items-center py-2 hover:bg-grey-2/50 w-full rounded-[10px] transition-all duration-200 ease-linear">
                                                    <div className={cn("h-5 flex items-center gap-2", item.id === plan && "text-typo-accent")}>
                                                        <span>{item.name} ({item.min_q_cover} - {item.max_q_cover})</span>
                                                    </div>

                                                    <CheckIcon className={cn("size-4", item.id === plan ? 'opacity-100' : 'opacity-0')} color={colors.background.primary} />
                                                </Button>
                                            );
                                        }) : null
                                    }
                                </>

                            </DrawerContent>
                        </Drawer>
                }
            </section >
        );
    }
);

export default memo(InsurancePlanInput);