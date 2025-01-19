import React, { ReactNode } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./Base";
import ChevronIcon from '../Icons/ChevronIcon';
import { cn } from '@/utils';

type AccordionWrapperProps = {
    children: ReactNode;
    content: ReactNode;
    labelClassName?: string;
    contentClassName?: string;
};

const CoinListWrapper = ({ children, content, contentClassName, labelClassName }: AccordionWrapperProps) => {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="main" className="relative rounded border data-[state=closed]:border-divider-secondary data-[state=open]:border-divider-primary">
                <AccordionTrigger className={
                    cn("[&[data-state=open]>div]:rotate-180 [&[data-state=closed]>div]:rounded-tl [&[data-state=closed]>div]:border-t [&[data-state=closed]>div]:border-l [&[data-state=closed]>div]:border-divider-secondary [&[data-state=open]>div]:rounded-br [&[data-state=open]>div]:border-r [&[data-state=open]>div]:border-b [&[data-state=open]>div]:border-divider-primary",
                        labelClassName)} showArrow={false}>
                    {children}
                    <div className="px-0.5 py absolute bottom-0 right-0">
                        <ChevronIcon className="size-2.5 shrink-0 text-muted-foreground transition-transform duration-200 [&[data-state=open]>path]:fill-typo-accent [&[data-state=closed]>path]:fill-typo-secondary" />
                    </div>
                </AccordionTrigger>
                <AccordionContent className={cn("p-3 pb-8", contentClassName)}>
                    {content}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default CoinListWrapper;