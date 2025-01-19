"use client";

import colors from "@/colors";
import { cn } from "@/utils";
import { ReactElement, ReactNode, forwardRef, memo } from "react";
import {
    InputAttributes,
} from "react-number-format";
import Button from "../Button";
import ChevronIcon from "../Icons/ChevronIcon";
import Popup from "../Popup";
import TooltipCustom from "../Tooltip";

export type InputDropdownProps = {
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
    // value?: string | number;
    defaultValue?: string | number;
    decimal?: number;
    onChangeStatus?: () => void;
    onBlur?: InputAttributes["onBlur"];
    onFocus?: InputAttributes["onFocus"];
    size: "md" | "lg";
    min?: number;
    max?: number;
    tooltip?: string | ReactNode;
    disabled?: boolean;
    placement?: 'bottom' | 'left' | 'right' | 'top';

    // Popup
    value?: ReactElement | string;
    label: string;
    content: ReactElement;
    align?: "start" | "center" | "end";
    toggle: boolean;
    onToggle: () => void;
};

const FormInputDropdown = forwardRef<HTMLInputElement, InputDropdownProps>(
    (
        {
            disabled = false,
            tooltip,
            label,
            extraLabel,
            wrapperClassInput,
            labelClassName,
            errorMessage,
            warning,
            descriptionMessage,
            value,
            placement,
            content,
            align,
            toggle,
            onToggle,
        },
        ref,
    ) => {
        // const { handleToggle, toggle } = useToggle();
        return (
            <section className="text-typo-primary flex flex-col items-start justify-between w-full">
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
                <Popup
                    collisionPadding={20}
                    classContent="w-[250px] max-h-[200px]"
                    isOpen={toggle}
                    handleOnChangeStatus={onToggle}
                    content={content}
                    align={align}
                >
                    <Button
                        size="lg"
                        className={cn(
                            "border-divider-secondary mt-2 flex w-full rounded border bg-transparent px-3 py-2 bg-support-black",
                            errorMessage && "border-negative",
                            warning && "border-warning",
                            wrapperClassInput,
                        )}
                    >
                        <section className="flex w-full items-center justify-between h-8 text-typo-primary">
                            {value}
                            <ChevronIcon
                                className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
                                color={toggle ? colors.typo.accent : colors.typo.secondary}
                            />
                        </section>
                    </Button>
                </Popup>
                {
                    errorMessage ? (
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
                        </div>
                }
            </section >
        );
    },
);

export default memo(FormInputDropdown);
