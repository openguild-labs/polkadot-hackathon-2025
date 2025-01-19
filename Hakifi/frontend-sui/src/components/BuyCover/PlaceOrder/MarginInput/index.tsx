"use client";

import { FormValue } from "@/@type/common.type";
import colors from "@/colors";
import Button from "@/components/common/Button";
import FormInputNumber, { InputNumberProps } from "@/components/common/FormInput/InputNumber";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
import useToggle from "@/hooks/useToggle";
import useBuyCoverStore from "@/stores/buy-cover.store";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/format";
import dynamic from "next/dynamic";
import { forwardRef, memo, useMemo } from "react";
import { UseFormSetValue } from "react-hook-form";

const AdjustMargin = dynamic(() => import("./Modal"), { ssr: false });

type ExterLabelMarginInputProps = Omit<InputNumberProps & {
    setValue: UseFormSetValue<FormValue>;
}, "label" | "size">;

const Suffix = memo(({ setValue, value, ...props }: ExterLabelMarginInputProps) => {
    const q_covered = useBuyCoverStore(state => state.q_covered);
    const percent = useMemo(() => {
        let percent;
        if (q_covered > 0) {

            percent = ((Number(value) / q_covered) * 100);
        } else {
            percent = 0;
        }

        return percent;
    }, [value, q_covered]);

    const { toggle, handleToggle } = useToggle();

    const handleOpenModal = () => {
        if (q_covered > 0) handleToggle();
    };

    return (
        <>
            <Button size="sm" variant="outline" point={false} className="flex items-center gap-1 !py-1 !px-2 !rounded-sm h-[25px]" onClick={handleOpenModal}>
                <span className={cn(toggle ? "text-typo-accent" : "text-typo-primary")}> {formatNumber(percent, 2)}% </span>
                <ChevronIcon
                    className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
                    color={toggle ? colors.typo.accent : colors.typo.secondary}
                />
            </Button>

            <AdjustMargin
                size="lg"
                label="Margin"
                toggle={toggle}
                value={value}
                handleToggle={handleToggle}
                setValue={setValue}
                {...props}
            />
        </>
    );
});

type MarginInputProps = Omit<InputNumberProps & {
    onChange: (value?: number) => void;
    errorMessage?: string;
    setValue: UseFormSetValue<FormValue>;
}, "label" | "size">;

const MarginInput = forwardRef<HTMLInputElement, MarginInputProps>(
    ({ value, onChange, setValue, ...props }, forwardRef) => {
        const q_covered = useBuyCoverStore(state => state.q_covered);
        const descriptionMessage = useMemo(() => {
            let percent;
            if (q_covered > 0) {
                percent = formatNumber((Number(value) / q_covered) * 100);
            } else {
                percent = 0;
            }
            return '~ ' + (percent) + '% of Insured Value';
        }, [value, q_covered]);

        return (
            <>
                <FormInputNumber
                    ref={forwardRef}
                    extraLabel={<Suffix setValue={setValue} value={value} {...props} />}
                    suffix="USDT"
                    placeholder="Margin"
                    tooltip="Margin of insurance contract. Customize margin will affect the claim amount"
                    size="lg"
                    label="Margin"
                    value={value}
                    onChange={(values) => onChange(values.floatValue)}
                    wrapperClassLabel="border-b border-dashed border-typo-secondary"
                    descriptionMessage={descriptionMessage}
                    {...props}
                />
            </>
        );
    },
);

export default MarginInput;
