import { cn } from '@/utils';
import { ReactNode } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./Base";

type AccordionWrapperProps = {
    children: ReactNode;
    content: ReactNode;
    labelClassName?: string;
    contentClassName?: string;
};

const AccordionCustom = ({ children, content, contentClassName, labelClassName }: AccordionWrapperProps) => {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="main" className="rounded border data-[state=closed]:border-transparent data-[state=open]:border-divider-primary">
                <AccordionTrigger className={
                    cn("[&[data-state=closed]>div]:rounded-tl [&[data-state=closed]>div]:border-t [&[data-state=closed]>div]:border-l [&[data-state=closed]>div]:border-divider-secondary [&[data-state=open]>div]:rounded-br [&[data-state=open]>div]:border-r [&[data-state=open]>div]:border-b [&[data-state=open]>div]:border-divider-primary flex justify-between",
                        labelClassName)} showArrow={true}>
                    {children}
                </AccordionTrigger>
                <AccordionContent className={cn("p-4", contentClassName)}>
                    {content}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default AccordionCustom;