"use client";

import { FormValue } from "@/@type/common.type";
import FormInputNumber, { InputNumberProps } from "@/components/common/FormInput/InputNumber";
import { Skeleton } from "@/components/common/Skeleton";
import ToggleSwitch from "@/components/common/ToggleSwitch";
import { Ticker, useTickerSocket } from "@/hooks/useTickerSocket";
import useToggle from "@/hooks/useToggle";
import useBuyCoverStore from "@/stores/buy-cover.store";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/format";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { forwardRef, useMemo, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

const PClaimSlider = dynamic(() => import("./Slider"), {
    loading: () => <section className="h-[60px] w-20 flex items-center">
        <Skeleton className="h-3 w-full" />
    </section>,
    ssr: false
});

type ClaimInputProps = Omit<InputNumberProps & {
    onChange: (value?: number) => void;
    errorMessage?: string;
    setValue: UseFormSetValue<FormValue>;
    min: number;
    max: number;
}, "label" | "size">;

const ClaimInput = forwardRef<HTMLInputElement, ClaimInputProps>(
    ({ value, onChange, setValue, min, max, ...props }, forwardRef) => {
        const { toggle, handleToggle } = useToggle();
        const { q_claim, side } = useBuyCoverStore();

        const { symbol } = useParams();

        const [ticker, setTicker] = useState<Ticker | null>(null);
        useTickerSocket(symbol, setTicker);
        const p_market = useMemo(() => ticker?.lastPrice, [ticker]);
        const descriptionMessage = "Min: " + formatNumber(min < 0 ? 0 : min, 5) + ", Max: " + formatNumber(max < 0 ? 0 : max, 5);
        const invalidPClaim = useMemo(() => {
            const floor = min < 0 ? 0 : min;
            const ceil = max < 0 ? 0 : max;
            if (value && (Number(value) < floor || Number(value) > ceil)) {
                
                return "Min: " +
                    formatNumber(floor, 5) +
                    ", Max: " +
                    formatNumber(ceil, 5);
            }

            return "";
        }, [min, max, value]);

        return (
            <section>
                <FormInputNumber
                    ref={forwardRef}
                    extraLabel={
                        <section className="text-typo-accent flex items-center gap-2 text-body-14">
                            <ToggleSwitch onChange={handleToggle} defaultValue={toggle} /> %
                        </section>
                    }
                    min={min}
                    max={max}
                    suffix="USDT"
                    placeholder="Claim price"
                    tooltip={
                        <p>The price triggering your insurance payment. When the market price reaches <span className={cn(side === ENUM_INSURANCE_SIDE.BULL ? "text-positive" : "text-negative")}>{formatNumber(value)}</span> USDT, you will claim <span className="text-positive">{formatNumber(q_claim)}</span> USDT</p>
                    }
                    size="lg"
                    label="Claim price"
                    disabled={toggle}
                    decimal={5}
                    value={value}
                    onChange={(values) => onChange(values.floatValue || 0)}
                    wrapperClassInput="items-center"
                    labelClassName="border-b border-dashed border-typo-secondary"
                    descriptionMessage={descriptionMessage}
                    errorMessage={invalidPClaim}
                    {...props}
                />

                {
                    toggle && !!p_market && <section className="mt-3">
                        <PClaimSlider
                            min={min}
                            max={max}
                            p_market={p_market}
                            onChange={onChange}
                        />
                    </section>
                }
            </section>
        );
    },
);

export default ClaimInput;
