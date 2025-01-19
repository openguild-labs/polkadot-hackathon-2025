import { FormValue } from "@/@type/common.type";
import { PairDetail } from "@/@type/pair.type";
import CheckIcon from "@/components/common/Icons/CheckIcon";
import ContractIcon from "@/components/common/Icons/ContractIcon";
import TooltipCustom from "@/components/common/Tooltip";
import useBalance from "@/hooks/useBalance";
import { useIsTablet } from "@/hooks/useMediaQuery";
import useAppStore from "@/stores/app.store";
import useBuyCoverStore from "@/stores/buy-cover.store";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/format";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";
import { memo, useEffect, useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import ClaimInput from "../ClaimInput";
import InsurancePlanInput from "../InsurancePlan";
import MarginInput from "../MarginInput";
import ModeInput from "../ModeInput";
import Period from "../Period";
import SubmitButton from "./SubmitButton";

type FormBuyCoverProps = {
    pair: PairDetail;
    pClaimRange: {
        min: number;
        max: number;
    } | null;
    form: UseFormReturn<FormValue>;
    handleToggleModalDetail: () => void;
    handleConfirmAction: () => void;
};

const FormBuyCover = ({
    pClaimRange,
    pair,
    form,
    handleToggleModalDetail,
    handleConfirmAction,
}: FormBuyCoverProps) => {
    const isTablet = useIsTablet();
    const { toggleConnectWalletModal } = useAppStore();
    const { toggleFormBuyCover } = useBuyCoverStore();
    const { p_claim, margin, q_claim, side } = useBuyCoverStore();

    const handleToggleConnectWallet = () => {
        toggleFormBuyCover(false);

        toggleConnectWalletModal(true);
    };

    const profit = q_claim ? q_claim - margin : 0;

    const modalTitle = useMemo(() => {
        const expect = side === ENUM_INSURANCE_SIDE.BULL ? "Bull" : "Bear";
        return expect;
    }, [side]);

    const { balance: usdtBalance, refetch, data } = useBalance();    
    
    useEffect(() => {
        setTimeout(() => {
            refetch();

        }, 1500);

    }, []);

    return (
        <>
            <section data-tour="place-order" className="flex flex-col gap-4">
                {!isTablet ? (
                    <Controller
                        name="side"
                        render={({ field }) => <ModeInput {...field} />}
                    />
                ) : (
                    <p className="text-title-20 lg:text-title-24 text-left">
                        <span
                            className={cn(
                                side === ENUM_INSURANCE_SIDE.BULL
                                    ? "text-positive-label"
                                    : "text-negative-label"
                            )}>
                            {modalTitle}
                        </span>{" "}
                        Insurance contract
                    </p>
                )}
                <section className="grid grid-cols-2 gap-3">
                    {/* <Period
						pair={pair}
						setValue={form.setValue}
					/> */}
                    <Controller
                        name="plan"
                        render={({ field, fieldState }) => (
                            <InsurancePlanInput
                                {...field}
                                setValue={form.setValue}
                            />
                        )}
                    />
                    <Controller
                        name="period"
                        render={({ field, fieldState }) => (
                            <Period
                                {...field}
                                setValue={form.setValue}
                                pair={pair}
                            />
                        )}
                    />

                </section>

                <Controller
                    name="margin"
                    render={({ field, fieldState }) => (
                        <MarginInput
                            {...field}
                            setValue={form.setValue}
                            setError={form.setError}
                        // errorMessage={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    name="p_claim"
                    render={({ field: { onChange, onBlur, value }, fieldState }) => (
                        <ClaimInput
                            pair={pair}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            min={pClaimRange?.min || 0}
                            max={pClaimRange?.max || 0}
                            setValue={form.setValue}
                            // errorMessage={fieldState.error?.message}
                        />
                    )}
                />
            </section>

            <section data-tour="confirm-order" className="!mt-6">
                <section className="border-divider-primary rounded border">
                    <section className="bg-background-secondary text-body-14 text-typo-accent rounded-t p-3">
                        Insurance benefit
                    </section>
                    <section className="flex flex-col gap-4 px-3 py-4 bg-support-black rounded-b">
                        <section className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <CheckIcon className="size-4" />
                                <TooltipCustom
                                    content={
                                        <p>
                                            Insurance payment value. When the market price reaches
                                            Claim price of{" "}
                                            <span
                                                className={cn(
                                                    side === ENUM_INSURANCE_SIDE.BULL
                                                        ? "text-positive"
                                                        : "text-negative"
                                                )}>
                                                {formatNumber(p_claim)}
                                            </span>{" "}
                                            USDT, a payment of{" "}
                                            <span className="text-positive">
                                                {formatNumber(q_claim)}
                                            </span>{" "}
                                            USDT will be automatically transferred to your wallet
                                        </p>
                                    }
                                    title={
                                        <p className="border-typo-secondary text-body-14 !text-typo-secondary border-b border-dashed">
                                            Claim amount
                                        </p>
                                    }
                                    showArrow={true}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-body-12 bg-background-primary text-typo-primary rounded-sm px-1 py-0.5">
                                    +{q_claim ? formatNumber((q_claim / margin) * 100) : 0}%
                                </p>
                                <p className="text-body-14 text-typo-primary">
                                    {q_claim ? formatNumber(q_claim) : "-"} USDT
                                </p>
                            </div>
                        </section>
                        <section className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <CheckIcon className="size-4" />
                                <TooltipCustom
                                    content={
                                        <>
                                            <div className="flex items-center">
                                                <p className="w-80">
                                                    Profit from insurance payment
                                                </p>
                                                <p className="whitespace-nowrap">
                                                    {formatNumber(profit)} USDT
                                                </p>
                                            </div>
                                        </>
                                    }
                                    contentClassName="!max-w-[330px]"
                                    title={
                                        <p className="border-typo-secondary text-body-14 !text-typo-secondary border-b border-dashed">
                                            Profit
                                        </p>
                                    }
                                    showArrow={true}
                                />
                            </div>
                            <p className="text-body-14 text-typo-primary">
                                Save {formatNumber(profit)} USDT
                            </p>
                        </section>
                    </section>
                </section>

                <section className="flex justify-between items-center mt-4 text-body-14">
                    <section className="text-typo-secondary">Available: <span className="text-typo-primary"> {formatNumber(usdtBalance)} USDT</span>
                    </section>
                    <div className="flex items-center gap-1 text-body-14 w-max text-typo-secondary">
                        <ContractIcon />
                        <div
                            className="border-b border-dashed border-typo-secondary cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleToggleModalDetail();
                            }}>
                            Insurance contract detail
                        </div>
                    </div>
                </section>

                <SubmitButton form={form} handleConfirmAction={handleConfirmAction} />

            </section>
        </>
    );
};

export default memo(FormBuyCover);
