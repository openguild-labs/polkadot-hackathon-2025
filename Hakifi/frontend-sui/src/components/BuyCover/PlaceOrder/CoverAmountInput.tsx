"use client";

import { FormValue } from "@/@type/common.type";
import FormInputNumber, { InputNumberProps } from "@/components/common/FormInput/InputNumber";
import { formatNumber } from "@/utils/format";
import { forwardRef } from "react";
import { UseFormSetValue } from "react-hook-form";

type CoverAmountInputProps = Omit<InputNumberProps & {
  onChange: (value?: number) => void;
  errorMessage?: string;
  setValue: UseFormSetValue<FormValue>;
}, "label" | "size">;
// const Suffix = memo(({ setValue }: { setValue: UseFormSetValue<FormValue>; }) => {
//   const [selected, setSelected] = useState("USDT");
//   const { toggle, handleToggle } = useToggle();
//   const changeAsset = useCallback((value: string) => {
//     setSelected(value);
//     handleToggle();

//     setValue("unit", value);
//   }, []);
//   const { symbol } = useParams();

//   const { baseAsset, quoteAsset } = useMemo(() => {
//     return {
//       baseAsset: `${symbol.toString().split("USDT")[0]}`,
//       quoteAsset: "USDT",
//     };
//   }, [symbol]);

//   return (
//     <Popup
//       classTrigger="min-w-[54px] cursor-pointer"
//       isOpen={toggle}
//       handleOnChangeStatus={() => handleToggle()}
//       content={
//         <section className="flex flex-col items-start gap-2 border-primary-1 p-4">
//           <Button
//             size="md"
//             className={cn(
//               "flex items-center justify-between outline-none w-full gap-2 hover:text-typo-accent",
//               selected === quoteAsset ? "text-typo-accent" : "text-typo-secondary",
//             )}
//             onClick={() => changeAsset(quoteAsset)}>
//             <div>{quoteAsset}</div>
//             {selected === quoteAsset ? (
//               <CheckIcon color={colors.typo.accent} className="size-4" />
//             ) : null}
//           </Button>
//           <Button
//             size="md"
//             className={cn(
//               "flex items-center justify-between outline-none w-full gap-2 hover:text-typo-accent",
//               selected === baseAsset ? "text-typo-accent" : "text-typo-secondary",
//             )}
//             onClick={() => changeAsset(baseAsset)}>
//             <div>{baseAsset}</div>
//             {selected === baseAsset ? (
//               <CheckIcon color={colors.typo.accent} className="size-4" />
//             ) : null}
//           </Button>
//         </section>
//       }>
//       <div className="text-body-14 flex items-center">
//         <span className={cn("mr-1 min-w-[30px] text-right", toggle && "text-typo-accent")}>{selected}</span>
//         <ChevronIcon
//           className={cn(
//             "transition-all duration-200 ease-linear",
//             toggle ? "rotate-180" : "rotate-0",
//           )}
//           color={toggle ? colors.typo.accent : colors.typo.secondary}
//         />
//       </div>
//     </Popup>
//   );
// });

const CoverAmountInput = forwardRef<HTMLInputElement, CoverAmountInputProps>(
  ({ value, onChange, setValue, ...props }, forwardRef) => {
    const descriptionMessage = "Min: " + (75) + ", Max: " + formatNumber(10000);
    return (
      <FormInputNumber
        ref={forwardRef}
        suffix={<p className="text-body-14 text-typo-secondary">USDT</p>}
        placeholder="Q-Cover"
        tooltip=" The insured value of your spot asset or derivative volume. Customize Insured value will affect the margin limit. You are insuring an asset/position volume worth 75 USDT"
        size="lg"
        label="Insured value"
        value={value}
        onChange={(values) => {
          if (values.floatValue) {
            setValue("margin", values.floatValue * 0.05, { shouldValidate: true });
          }
          else {
            setValue("margin", 0, { shouldValidate: true });
          }
          onChange(values.floatValue || 0);
        }}
        wrapperClassLabel="border-b border-dashed border-typo-secondary"
        descriptionMessage={descriptionMessage}
        {...props}
      />
    );
  },
);

export default CoverAmountInput;
