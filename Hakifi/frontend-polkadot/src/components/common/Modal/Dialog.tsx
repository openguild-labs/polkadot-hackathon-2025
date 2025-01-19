"use client";

import { useIsTablet } from "@/hooks/useMediaQuery";
import { cn } from "@/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { ReactNode } from "react";
import CloseIcon from "../Icons/CloseIcon";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-20 sm:top-[65px] top-[57px] bg-background-scrim/30 backdrop-blur-[15px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-2000",
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { showCloseButton?: boolean; size?: 'sm' | 'md' | 'lg'; prefix?: ReactNode; overlayClassName?: string; }
>(({ className, children, showCloseButton = true, prefix, size = 'lg', overlayClassName, ...props }, ref) => {
    const isTablet = useIsTablet();
    return (
        <DialogPortal>
            <DialogOverlay className={overlayClassName} />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed z-50 grid w-full gap-4 bg-background-tertiary duration-3000 py-4 sm:py-5",
                    size === 'sm' && !isTablet && "max-w-[488px]",
                    size === 'md' && !isTablet && "max-w-[588px]",
                    size === 'lg' && !isTablet && "max-w-[800px]",
                    isTablet ?

                        "left-0 bottom-0 translate-x-0 h-fit max-h-fit-screen-mobile data-[state=open]:animate-drawer-bottom-up data-[state=closed]:animate-drawer-bottom-down" :

                        "border rounded-lg border-divider-secondary left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
                    className
                )}
                {...props}
            >
                {children}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col text-center sm:text-left",
            className
        )}
        {...props}
    />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            "text-left lg:mb-5",
            className
        )}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("custom-scroll px-4 sm:px-5 overflow-y-auto lg:overflow-hidden", className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog, DialogClose,
    DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger
};

