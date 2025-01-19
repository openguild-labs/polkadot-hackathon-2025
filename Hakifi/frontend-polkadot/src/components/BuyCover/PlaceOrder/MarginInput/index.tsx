"use client";

import { FormValue } from "@/@type/common.type";
import FormInputNumber, { InputNumberProps } from "@/components/common/FormInput/InputNumber";
import { FIELDS } from "@/components/market/constants";
import useBalance from "@/hooks/useBalance";
import useBuyCoverStore from "@/stores/buy-cover.store";
import useInsuranceStore from "@/stores/insurance.store";
import { formatNumber } from "@/utils/format";
import { forwardRef, useEffect, useMemo } from "react";
import { UseFormSetError, UseFormSetValue } from "react-hook-form";

/* Comment on demand  */
// const AdjustMargin = dynamic(() => import("./Modal"), { ssr: false });

// type ExterLabelMarginInputProps = Omit<InputNumberProps & {
//     setValue: UseFormSetValue<FormValue>;
// }, "label" | "size">;

// const Suffix = memo(({ setValue, value, ...props }: ExterLabelMarginInputProps) => {
//     const q_covered = useBuyCoverStore(state => state.q_covered);
//     const percent = useMemo(() => {
//         let percent;
//         if (q_covered > 0) {

//             percent = ((Number(value) / q_covered) * 100);
//         } else {
//             percent = 0;
//         }

//         return percent;
//     }, [value, q_covered]);

//     const { toggle, handleToggle } = useToggle();

//     const handleOpenModal = () => {
//         if (q_covered > 0) handleToggle();
//     };

//     return (
//         <>
//             <Button size="sm" variant="outline" point={false} className="flex items-center gap-1 !py-1 !px-2 !rounded-sm h-[25px]" onClick={handleOpenModal}>
//                 <span className={cn(toggle ? "text-typo-accent" : "text-typo-primary")}> {formatNumber(percent, 2)}% </span>
//                 <ChevronIcon
//                     className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
//                     color={toggle ? colors.typo.accent : colors.typo.secondary}
//                 />
//             </Button>

//             <AdjustMargin
//                 size="lg"
//                 label="Margin"
//                 toggle={toggle}
//                 value={value}
//                 handleToggle={handleToggle}
//                 setValue={setValue}
//                 {...props}
//             />
//         </>
//     );
// });

type MarginInputProps = Omit<InputNumberProps & {
    onChange: (value?: number | string) => void;
    errorMessage?: string;
    setValue: UseFormSetValue<FormValue>;
    setError: UseFormSetError<FormValue>;
}, "label" | "size">;

const MarginInput = forwardRef<HTMLInputElement, MarginInputProps>(
    ({ value, onChange, setValue, setError, ...props }, forwardRef) => {
        const { plan, setErrorFields, removeErrorField } = useBuyCoverStore();
        const { plans } = useInsuranceStore();
        / Comment on demand /;
        // const descriptionMessage = useMemo(() => {
        //     let percent;
        //     if (q_covered > 0) {
        //         percent = formatNumber((Number(value) / q_covered) * 100);
        //     } else {
        //         percent = 0;
        //     }
        //     return '~ ' + (percent) + '% of Insured Value';
        // }, [value, q_covered]);

        const { balance: usdtBalance, refetch } = useBalance();
        useEffect(() => {
            setTimeout(() => {
                refetch();

            }, 1500);

        }, []);

        const selected = useMemo(() => {
            const defaultPlan = plans.find(item => item.id === 1); // -1 because index start from 0, and plan start from 1
            return plans.find(item => item.id === plan) || defaultPlan || plans[0]; // -1 because index start from 0, and plan start from 1
        }, [plan, plans]);

        const marginRangeValidate = useMemo(() => {
            const min = selected.min_margin;
            const max = selected.max_margin;
            if (!value || value === 0) {
                setErrorFields(FIELDS.MARGIN);
                return "Margin must be not empty or 0";
            }
            if(usdtBalance === 0) {
                setErrorFields(FIELDS.MARGIN);
                return `Insufficient balance`;
            }
            if (+value > usdtBalance) {
                setErrorFields(FIELDS.MARGIN);
                return `Margin must be less than balance`;
            }
            if (+value < min) {
                setErrorFields(FIELDS.MARGIN);
                return `Margin must be greater than ${formatNumber(min)}`;
            }
            if (+value > max) {
                setErrorFields(FIELDS.MARGIN);
                return `Margin must be less than ${formatNumber(max)}`;
            }
            removeErrorField(FIELDS.MARGIN);
            return "";
        }, [selected, value, usdtBalance]);

        const descriptionMessage = useMemo(() => {
            const min = selected.min_margin;
            const max = selected.max_margin;
            return "Min: " +
                formatNumber(min < 0 ? 0 : min) +
                ", Max: " +
                formatNumber(max < 0 ? 0 : max);
        }, [selected]);

        return (
            <>
                <FormInputNumber
                    ref={forwardRef}
                    // extraLabel={<Suffix setValue={setValue} value={value} {...props} />}
                    suffix="USDT"
                    placeholder="Margin"
                    tooltip="Margin of insurance contract. Customize margin will affect the claim amount"
                    size="lg"
                    label="Margin"
                    value={value}
                    onChange={(values) => {
                        // removeErrorField(FIELDS.MARGIN);
                        onChange(values.floatValue || '');
                    }}
                    wrapperClassLabel="border-b border-dashed border-typo-secondary"
                    descriptionMessage={descriptionMessage}
                    errorMessage={marginRangeValidate}
                    {...props}
                />
            </>
        );
    },
);

export default MarginInput;
