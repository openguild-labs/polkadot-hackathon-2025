"use client";

import CloseIcon from '@/components/common/Icons/CloseIcon';
import Input from '@/components/common/Input';
import { cn } from '@/utils';
import React, { ReactElement, ReactNode, forwardRef, useState } from 'react';


type InputProps = {
    suffix?: ReactNode;
    prefix?: ReactElement | string;
    prefixClassName?: string;
    suffixClassName?: string;
    errorMessage?: string;
    wrapperClassName?: string;
    wrapperClassInput?: string;
    size: 'md' | 'lg';
    placeholder?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    value?: string;
    className?: string;
    classFocus?: string;
};

const FormInput = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            prefixClassName,
            prefix,
            suffix,
            suffixClassName,
            errorMessage,
            wrapperClassName,
            wrapperClassInput,
            size = 'md',
            className = "",
            classFocus,
            value,
            ...props
        },
        ref,
    ) => {
        const handleOnClose = () => {

        };

        return (
            <section
                className={cn("flex flex-col items-start gap-1 w-full", wrapperClassName)}>
                <section className={cn("border border-divider-secondary rounded hover:border-divider-primary duration-300 focus-within:border-divider-primary focus-within:text-typo-accent focus-within:[&>path]:fill-typo-accent", wrapperClassInput)}>
                    <Input
                        size={size}
                        ref={ref}
                        prefix={prefix}
                        prefixClassName={prefixClassName}
                        suffix={suffix}
                        suffixClassName={suffixClassName}
                        className={className}
                        classFocus={classFocus}
                        value={value}
                        {...props}
                    />
                </section>
                {errorMessage ? (
                    <div
                        className="text-body-12 text-red max-h-0 overflow-hidden transition-all duration-200">
                        <div>{errorMessage}</div>
                    </div>
                ) : null}
            </section>
        );
    },
);

export default FormInput;
