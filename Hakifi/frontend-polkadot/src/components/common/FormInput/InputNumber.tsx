"use client";

import { cn } from "@/utils";
import { ReactElement, ReactNode, forwardRef, useState } from "react";
import NumericFormat, {
  InputAttributes,
  NumberFormatValues
} from "react-number-format";
import TooltipCustom from "../Tooltip";

export type InputNumberProps = {
  label: ReactElement | string;
  extraLabel?: ReactElement;
  suffix?: ReactElement | string;
  wrapperClassInput?: string;
  labelClassName?: string;
  wrapperClassLabel?: string;
  className?: string;
  prefixClassName?: string;
  suffixClassName?: string;
  warning?: boolean;
  errorMessage?: string;
  placeholder?: string;
  descriptionMessage?: string;
  value?: string | number;
  defaultValue?: string | number;
  decimal?: number;
  onChange?: (values: NumberFormatValues) => void;
  onBlur?: InputAttributes["onBlur"];
  onFocus?: InputAttributes["onFocus"];
  size: "md" | "lg";
  min?: number;
  max?: number;
  tooltip?: string | ReactNode;
  disabled?: boolean;
  placement?: 'bottom' | 'left' | 'right' | 'top';
};

const FormInputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      disabled = false,
      tooltip,
      label,
      extraLabel,
      suffix,
      wrapperClassInput,
      labelClassName,
      wrapperClassLabel,
      className,
      prefixClassName,
      placeholder,
      suffixClassName,
      errorMessage,
      warning,
      descriptionMessage,
      onBlur,
      onFocus,
      value,
      defaultValue,
      decimal = 5,
      onChange,
      min,
      max,
      placement
    },
    ref,
  ) => {
    const [_focus, setFocus] = useState(false);

    const _handleOnFocus: InputAttributes["onFocus"] = (e) => {
      setFocus(true);
      if (onFocus) onFocus(e);
    };
    const _handleOnBlur: InputAttributes["onBlur"] = (e) => {
      setFocus(false);
      if (onBlur) onBlur(e as any);
    };

    return (
      <section className="text-typo-primary flex flex-col items-start justify-between ">
        <section
          className={cn("flex w-full justify-between", wrapperClassInput)}
        >
          <TooltipCustom
            content={tooltip || ""}
            titleClassName="text-typo-primary"
            placement={placement}
            title={
              <div
                className={cn(
                  "border-typo-secondary border-b border-dashed",
                  labelClassName,
                )}
              >
                {label}
              </div>
            }
            showArrow={true}
          />
          <section>{extraLabel}</section>
        </section>
        <section
          className={cn(
            "border-divider-secondary mt-2 flex w-full rounded border bg-transparent px-3 md:py-2 py-1 bg-support-black",
            errorMessage && "border-negative",
            warning && "border-warning",
            wrapperClassInput,
          )}
        >
          <section className="flex w-full items-center justify-between h-8">
            <NumericFormat
              allowNegative={false}
              disabled={disabled}
              inputMode="decimal"
              defaultValue={defaultValue}
              onFocus={_handleOnFocus}
              onBlur={_handleOnBlur}
              thousandSeparator
              allowedDecimalSeparators={[',', '.']}
              getInputRef={ref}
              decimalScale={decimal}
              className={cn(
                "text-typo-primary placeholder:text-typo-secondary w-full bg-transparent text-left focus:outline-none md:text-body-16 text-body-12",
                className,
              )}
              placeholder={placeholder}
              value={value}
              onValueChange={(values)=> {
                onChange && onChange(values)
              }}
              min={0}
              // max={max}
              type="text"
            />
            {suffix && (
              <div className="text-body-12 text-typo-secondary whitespace-nowrap">
                {suffix}
              </div>
            )}
          </section>
        </section>
        {errorMessage ? (
          <div
            className={cn(
              "!text-negative-label overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200 pt-1 text-body-12",
            )}
          >
            {errorMessage}
          </div>
        ) :
          <div
            className={cn(
              "!text-typo-secondary max-h-0 overflow-hidden transition-all duration-200 pt-1 text-body-12",
              !errorMessage && descriptionMessage && "!max-h-max",
            )}
          >
            {descriptionMessage}
          </div>}
      </section>
    );
  },
);

export default FormInputNumber;
