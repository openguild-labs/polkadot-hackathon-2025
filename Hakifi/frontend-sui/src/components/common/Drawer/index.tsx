import { useIsTablet } from "@/hooks/useMediaQuery";
import { cn } from "@/utils";
import { ReactNode } from "react";
import CloseIcon from "../Icons/CloseIcon";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "./Base";

type DrawerWrapperProps = {
    children?: ReactNode;
    prefix?: ReactNode;
    title?: string;
    description?: string;
    content: ReactNode;
    footer?: ReactNode;
    isOpen?: boolean;
    modal?: boolean;
    classNameTitle?: string;
    handleOpenChange?: () => void;
    handleClickOutside?: (e: any) => void;
};

const DrawerWrapper = ({ modal = true, children, prefix, title, description, content, footer, isOpen, handleOpenChange, classNameTitle, handleClickOutside }: DrawerWrapperProps) => {
    const isTablet = useIsTablet();

    return (
        <Drawer open={isOpen} modal={modal} onRelease={handleOpenChange}>
            {
                children ? <DrawerTrigger asChild onClick={handleOpenChange}>
                    {children}
                </DrawerTrigger> : null
            }
            <DrawerContent
                // onInteractOutside={handleClickOutside}
                // data-vaul-no-drag
            >
                <DrawerHeader>
                    <div className={cn("flex items-center", prefix ? "justify-between" : "justify-end")}>
                        {
                            prefix
                        }

                        <DrawerClose onClick={handleOpenChange}>
                            <CloseIcon />
                        </DrawerClose>
                    </div>
                    {title ? <DrawerTitle className="!text-title-20 text-typo-primary my-5">{title}</DrawerTitle> : null}
                    {description ? <DrawerDescription>{description}</DrawerDescription> : null}
                </DrawerHeader>
                {content}
                {footer ? <DrawerFooter>
                    {footer}
                </DrawerFooter> : null}
            </DrawerContent>
        </Drawer>
    );
};

export default DrawerWrapper;
