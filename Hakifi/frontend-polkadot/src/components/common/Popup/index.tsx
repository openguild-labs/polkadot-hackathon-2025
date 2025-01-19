"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/common/Popup/Popover";
import { cn } from "@/utils";
import { ReactNode } from "react";

type PopupProps = {
    isOpen?: boolean;
    handleOnChangeStatus?: (() => void);
    children: ReactNode;
    content: ReactNode;
    classContent?: string;
    classTrigger?: string;
    asChild?: boolean;
    align?: "start" | "center" | "end";
    isModal?: boolean;
    sideOffset?: number;
    collisionPadding?: number;
};

export function Popup({ children, content, classContent, classTrigger, isOpen, align, isModal = false, handleOnChangeStatus, asChild = true, sideOffset = 8, collisionPadding = 16 }: PopupProps) {
    return (
        <Popover modal={isModal} onOpenChange={handleOnChangeStatus} open={isOpen}>
            <PopoverTrigger asChild={asChild} className={classTrigger}>
                {children}
            </PopoverTrigger>
            <PopoverContent align={align} className={cn("max-h-[500px] overflow-auto custom-scroll", classContent)} collisionPadding={collisionPadding} sideOffset={sideOffset}>
                {content}
            </PopoverContent>
        </Popover>
    );
}

export default Popup;
