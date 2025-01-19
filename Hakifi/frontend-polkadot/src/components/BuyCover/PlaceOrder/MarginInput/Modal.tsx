"use client";

import { FormValue } from '@/@type/common.type';
import colors from '@/colors';
import Button from '@/components/common/Button';
import { Drawer, DrawerContent, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle } from '@/components/common/Drawer/Base';
import FormInputNumber, { InputNumberProps } from '@/components/common/FormInput/InputNumber';
import CloseIcon from '@/components/common/Icons/CloseIcon';
import Modal from '@/components/common/Modal';
import SliderWrapper from '@/components/common/Slider';
import TooltipCustom from '@/components/common/Tooltip';
import useBalance from '@/hooks/useBalance';
import { useIsTablet } from '@/hooks/useMediaQuery';
import useTicker from '@/hooks/useTicker';
import { informula } from '@/lib/informula';
import useBuyCoverStore from '@/stores/buy-cover.store';
import { cn } from '@/utils';
import { HEDGE_INIT, MARGIN_PERCENT } from '@/utils/constant';
import { formatNumber } from '@/utils/format';
import { ENUM_INSURANCE_SIDE, PERIOD_UNIT } from 'hakifi-formula';
import { useParams } from 'next/navigation';
import { forwardRef, memo, useEffect, useMemo, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

type AdjustMarginInputProps =
    InputNumberProps & {
        toggle: boolean;
        handleToggle: () => void;
        setValue: UseFormSetValue<FormValue>;
    };

const AdjustMargin = forwardRef<HTMLInputElement, AdjustMarginInputProps>(
    (
        { toggle, handleToggle, onChange, value, setValue, ...props },
        forwardRef,
    ) => {
        const { symbol } = useParams();
        const [p_claim, side, periodChangeRatio, periodUnit, q_claim] = useBuyCoverStore(
            (state) => [
                state.p_claim,
                // state.q_covered,
                state.side,
                state.periodChangeRatio,
                state.periodUnit,
                state.q_claim
            ]
        );

        const ticker = useTicker(symbol as string);
        const p_market = ticker?.lastPrice || 0;

        const [margin, setMargin] = useState(value || 3.75);
        const handleOnChangeValue = (value?: number) => {
            setMargin(value as number);
            // setPercent(Number(value) / Number(q_covered));
        };

        const [percent, setPercent] = useState(0);
        const handleChangePercent = (percent: number) => {
            setPercent(percent);
            // setMargin(formatNumber(percent * q_covered));
        };

        useEffect(() => {
            if (toggle) {
                setMargin(value as number);

                // setPercent(informula.calculateHedge(value as number, q_covered));
            }
        }, [toggle]);

        const handleConfirm = () => {
            setValue("margin", Number(margin));
            handleToggle();
        };

        const handleCloseModal = () => {
            setPercent(0);
            setMargin(value as number);
            handleToggle();
        };

        const general = useMemo(() => {
            if (!margin || !q_claim) return {
                q_claim: 0,
                r_claim: 0,
            };
            let getQClaim = 0;
            try {
                getQClaim = informula.calculateQClaim({
                    // hedge: percent as number || HEDGE_INIT,
                    day_change_token: periodChangeRatio as number,
                    margin: margin as number,
                    p_claim: p_claim as number,
                    p_open: p_market,
                    // period_unit: periodUnit as PERIOD_UNIT,
                });
            } catch (error) {
                // throw error
            }
            const _q_claim = p_claim !== value ? getQClaim : q_claim || 0;

            const r_claim = (_q_claim / Number(margin)) * 100 || 0;

            return {
                q_claim: _q_claim || 0,
                r_claim,
            };
        }, [p_claim, q_claim, p_market]);

        const { balance } = useBalance();

        // const { address } = useAccount();
        // const usdtBalance = useBalance({
        //     address,
        //     token: USDT_ADDRESS,
        // });

        // const balance = usdtBalance.data ? parseFloat(usdtBalance.data.formatted) : 0;

        // const descriptionMessage = useMemo(() => {
        //     const percent = (Number(margin) / q_covered) * 100;
        //     return "~ " + formatNumber(percent) + "% of Insured Value";
        // }, [margin]);

        // const errorMessage = useMemo(() => {
        //     const min = Number(q_covered) * 0.02;
        //     let max = Number(q_covered) * 0.1;
        //     if (max > balance) max = balance;
        //     const invalidMargin = "Maximum " + formatNumber(max) + " minimum " + formatNumber(min);
        //     if (Number(margin) > max || Number(margin) < min) return invalidMargin;
        //     return '';
        // }, [margin, q_covered, balance]);
        const isTablet = useIsTablet();

        const marks = useMemo(() => {

            return Object.keys(MARGIN_PERCENT).map(item => ({
                value: item,
                label: MARGIN_PERCENT[Number(item)]
            }));
        }, [

        ]);

        if (isTablet) {
            return <Drawer open={toggle} modal={true}>
                <DrawerPortal>
                    <DrawerOverlay className="!z-[51] bg-background-scrim" />
                </DrawerPortal>
                <DrawerContent onInteractOutside={handleCloseModal} className="!z-[60]">
                    <DrawerHeader>
                        <div className="flex justify-end items-center">
                            <CloseIcon onClick={handleCloseModal} />
                        </div>
                        <DrawerTitle className="!text-title-20 text-typo-primary my-5">Customize margin</DrawerTitle>
                    </DrawerHeader>
                    <>
                        <FormInputNumber
                            ref={forwardRef}
                            suffix="USDT"
                            placeholder="Margin"
                            tooltip="Margin of insurance contract. Customize margin will change the total received Q-Claim"
                            wrapperClassLabel="border-b border-dashed border-typo-secondary"
                            value={margin as number}
                            onChange={(values) => handleOnChangeValue(values.floatValue || 75)}
                            // descriptionMessage={descriptionMessage}
                            // errorMessage={errorMessage}
                            {...props}
                        />

                        <section className="mt-10 w-full px-2 p-claim-slider">
                            <SliderWrapper
                                min={0.02}
                                max={0.1}
                                marks={MARGIN_PERCENT}
                                value={percent}
                                step={0.01}
                                onChange={handleChangePercent}
                                activeDotStyle={{
                                    color: colors.typo.accent,
                                    backgroundColor: colors.background.primary
                                }}
                            />
                        </section>

                        <div className="mt-5 flex flex-col gap-4 border border-divider-secondary p-4 bg-support-black rounded">
                            <div className="flex items-center justify-between gap-1 text-body-14">
                                <p className="text-body-14 text-typo-secondary">Available</p>
                                <p className="text-body-14 text-typo-primary">
                                    {formatNumber(balance)} USDT
                                </p>
                            </div>
                            <div className="text-body-14 flex items-center justify-between gap-1 ">
                                <TooltipCustom
                                    content="Q-Claim"
                                    titleClassName="text-typo-primary"
                                    title={<p className="text-body-14 border-b border-dashed border-typo-secondary text-typo-secondary">
                                        Claim amount
                                    </p>}
                                    showArrow={true}
                                />
                                <div className="text-typo-primary text-body-14">
                                    {formatNumber(general.q_claim)} USDT{' '}
                                    <span className="text-positive">
                                        (+{formatNumber(general.r_claim)}%)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button
                            // disabled={!value || !!errorMessage || !margin}
                            variant={'primary'}
                            size={'lg'}
                            onClick={handleConfirm}
                            className="mt-5 w-full justify-center">
                            Confirm
                        </Button>
                    </>

                </DrawerContent>
            </Drawer>;
        }

        return (
            <Modal
                modal={true}
                isOpen={toggle}
                isMobileFullHeight
                onRequestClose={handleCloseModal}
                className="text-typo-primary"
                useDrawer={false}
                title="Custom Margin">
                <>
                    <FormInputNumber
                        ref={forwardRef}
                        suffix="USDT"
                        placeholder="Margin"
                        tooltip="Margin of insurance contract. Customize margin will change the total received claim amount"
                        wrapperClassLabel="border-b border-dashed border-typo-secondary"
                        value={margin as number}
                        onChange={(values) => handleOnChangeValue(values.floatValue)}
                        // descriptionMessage={descriptionMessage}
                        // errorMessage={errorMessage}
                        placement="right"
                        {...props}
                    />

                    <section className="!mt-10 w-full px-2 p-claim-slider">
                        <SliderWrapper
                            min={0.02}
                            max={0.1}
                            marks={MARGIN_PERCENT}
                            value={percent}
                            step={0.01}
                            onChange={handleChangePercent}
                            activeDotStyle={{
                                color: colors.typo.accent,
                                backgroundColor: colors.background.primary
                            }}
                            colorActive='fff'
                        />
                    </section>

                    <div className="!mt-5 flex flex-col gap-4 border border-divider-secondary p-4 bg-support-black rounded">
                        <div className="flex items-center justify-between gap-1 text-body-14">
                            <p className="text-body-14 text-typo-secondary">Available</p>
                            <p className="text-body-14 text-typo-primary">
                                {formatNumber(balance)} USDT
                            </p>
                        </div>
                        <div className="text-body-14 flex items-center justify-between gap-1 ">
                            <TooltipCustom
                                content={
                                    <p>
                                        Quanity of cover payout. When the market price reaches Claim price of <span className={cn(side === ENUM_INSURANCE_SIDE.BULL ? "text-positive" : "text-negative")}>{formatNumber(p_claim)}</span> USDT, the payout of <span className="text-positive">{formatNumber(q_claim)}</span> USDT will automatically be transferred to your wallet
                                    </p>
                                }
                                placement="right"
                                title={<p className="text-body-14 border-b border-dashed border-typo-secondary !text-typo-secondary">
                                    Claim amount
                                </p>}
                                showArrow={true}
                            />
                            <div className="text-typo-primary">
                                {formatNumber(general.q_claim)} USDT{' '}
                                <span className="text-positive">
                                    (+{formatNumber(general.r_claim)}%)
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button
                        // disabled={!value || !!errorMessage || !margin}
                        variant="primary"
                        size={'lg'}
                        onClick={handleConfirm}
                        className="!mt-5 w-full justify-center">
                        Confirm
                    </Button>
                </>

            </Modal>
        );
    },
);

export default memo(AdjustMargin);
