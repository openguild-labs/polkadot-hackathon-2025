"use client";

import { useIsTablet } from '@/hooks/useMediaQuery';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from './Dialog';
import { cn } from '@/utils';
import { memo, ReactNode, useEffect, useRef } from 'react';
import DrawerWrapper from '../Drawer';
import CloseIcon from '../Icons/CloseIcon';
import Button from '../Button';

type ModalProps = {
    onInteractOutside?: (e: any) => void;
    showCloseButton?: boolean;
    variant?: 'primary' | 'danger';
    title?: string | ReactNode;
    isMobileFullHeight?: boolean;
    children: ReactNode;
    prefix?: ReactNode;
    overlayClassName?: string;
    isOpen: boolean;
    asChild?: boolean;
    className?: string;
    contentClassName?: string;
    descriptionClassName?: string;
    desClassName?: string;
    onRequestClose: () => void;
    size?: 'sm' | 'md' | 'lg';
    modal?: boolean;
    useDrawer?: boolean;
    titleClassName?: string;
};

const Modal = ({
    children,
    prefix,
    showCloseButton = true,
    overlayClassName,
    contentClassName,
    descriptionClassName,
    desClassName,
    className,
    asChild = false,
    onInteractOutside,
    variant = 'primary',
    onRequestClose,
    modal = false,
    size = "sm",
    title,
    isOpen,
    useDrawer = true,
    titleClassName,
    ...rest
}: ModalProps) => {
    const isTablet = useIsTablet();
    const refModal = useRef<HTMLParagraphElement>(null);
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // useEffect(() => {
    //     if (refModal.current && refModal.current?.scrollHeight > refModal.current?.clientHeight) {
    //         refModal.current.classList.add("pr-1");
    //     }
    // }, []);

    if (isTablet) {
        return <>
            {
                !useDrawer ? <Dialog open={isOpen} onOpenChange={onRequestClose} {...rest}>
                    <DialogContent
                        onInteractOutside={onInteractOutside}
                        size={size}
                        className={cn("flex flex-col justify-start", contentClassName)}
                    >
                        <section className={cn("flex items-center px-4 sm:px-5", !!prefix ? "justify-between" : "justify-end")}>
                            {
                                !!prefix && prefix
                            }
                            {
                                showCloseButton && <Button size="lg" onClick={onRequestClose} className="flex justify-end rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
                                    <CloseIcon className="size-6" />
                                </Button>
                            }
                        </section>

                        {title ? <DialogTitle
                            asChild={asChild}
                            className="!text-title-24 text-typo-primary text-left px-4 sm:px-5">
                            {title}
                        </DialogTitle> : null}

                        <DialogDescription ref={refModal} asChild className={descriptionClassName}>
                            <section>
                                {children}
                            </section>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
                    : <DrawerWrapper
                        isOpen={isOpen}
                        handleOpenChange={onRequestClose}
                        title={title as string}
                        classNameTitle="!text-title-24 text-typo-primary"
                        content={
                            children
                        }
                    >
                    </DrawerWrapper>
            }
        </>;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onRequestClose} {...rest} modal={modal} >
            <DialogContent
                overlayClassName={overlayClassName}
                onInteractOutside={onInteractOutside}
                size={size}
                className={cn("sm:max-h-[740px]", contentClassName)}
            >
                <section className={cn("flex items-center px-4", !!prefix ? "justify-between" : "justify-end")}>
                    {
                        !!prefix && prefix
                    }
                    {
                        showCloseButton && <DialogClose className="flex justify-end rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
                            <CloseIcon className="size-6" />
                        </DialogClose>
                    }
                </section>

                {title !== undefined ? <DialogTitle
                    asChild={asChild}
                    className={cn("!text-title-24 text-typo-primary px-4 sm:px-5", titleClassName)}>
                    {title}
                </DialogTitle> : null}

                <DialogDescription asChild className={cn("max-h-[600px]", descriptionClassName)}>
                    <section>{children}</section>
                </DialogDescription>

            </DialogContent>
        </Dialog>
    );
};

export default memo(Modal);
