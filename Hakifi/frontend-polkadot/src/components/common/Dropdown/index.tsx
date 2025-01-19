import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./Base";
import FormInput from '../FormInput';
import SearchIcon from '../Icons/SearchIcon';

type DropdownWrapperProps = {
    onChange?: (value: string) => void;
    label: string;
    size: "md" | "lg";
    defaultValue: string;
    content: { label: string; value: string; }[];
    labelClassName?: string;
    border?: boolean;
    isSearch?: boolean;
    searchPlaceholder?: string;
};

const DropdownWrapper = ({ label, onChange, size = "lg", content, defaultValue, labelClassName, border, isSearch, searchPlaceholder }: DropdownWrapperProps) => {
    return (
        <Select onValueChange={onChange} defaultValue={defaultValue}>
            <SelectTrigger className={labelClassName} size={size} border={border}>
                {label}
            </SelectTrigger>
            <SelectContent className="p-4">
                {
                    isSearch ? <FormInput
                        placeholder={searchPlaceholder}
                        size="md"
                        prefix={<SearchIcon className="h-4 w-4" />}
                    /> : null
                }
                <SelectGroup>
                    {
                        content.map((item, index) => {
                            return <SelectItem key={item.label + index} value={item.value} size={size}>{item.label || ""}</SelectItem>;
                        })
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default DropdownWrapper;