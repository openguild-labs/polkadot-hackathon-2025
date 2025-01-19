import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BlockInputProps {
  input: {
    type: "number" | "text" | "address" | "select";
    label: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
    unit?: string;
  };
  value: string;
  onChange: (value: string) => void;
}

const BlockInput: React.FC<BlockInputProps> = ({ input, value, onChange }) => {
  const baseStyles = cn(
    "w-full bg-black/30 backdrop-blur-md border-2 border-primary/30 rounded-lg",
    "shadow-[2px_2px_0_0_rgba(255,255,255,0.1)]",
    "hover:shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] hover:translate-y-[-2px] hover:border-primary/50",
    "focus:shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] focus:translate-y-[-2px] focus:border-primary/50",
    "transition-all duration-200",
    "text-primary font-medium placeholder:text-primary/50",
    "focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
  );

  switch (input.type) {
    case "select":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            className={cn(
              baseStyles,
              "h-9 px-3",
              "data-[placeholder]:text-primary/50"
            )}
          >
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent className="bg-black/95 backdrop-blur-md border-2 border-primary/30 rounded-lg shadow-[4px_4px_0_0_rgba(255,255,255,0.1)]">
            {input.options?.map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="hover:bg-primary/20 text-primary font-medium cursor-pointer focus:bg-primary/20"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "number":
      return (
        <div className="relative">
          <Input
            type="number"
            placeholder={input.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(baseStyles, "h-9 px-3", input.unit ? "pr-10" : "")}
          />
          {input.unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70 text-sm font-medium">
              {input.unit}
            </span>
          )}
        </div>
      );

    default:
      return (
        <Input
          type="text"
          placeholder={input.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(baseStyles, "h-9 px-3")}
        />
      );
  }
};

export default BlockInput;
