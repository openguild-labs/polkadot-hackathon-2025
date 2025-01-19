import React, { ReactNode } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./Base";

type AccordionWrapperProps = {
    body: {
        label: string;
        content: ReactNode;
    }[];
    labelClassName?: string;
    contentClassName?: string;
};

const AccordionWrapper = ({ body, contentClassName, labelClassName }: AccordionWrapperProps) => {
    return (
        <Accordion type="single" collapsible>
            {
                body.map((item, index) => {
                    return <AccordionItem key={index} value={'item-' + index}>
                        <AccordionTrigger className={labelClassName}>
                            {item.label}
                        </AccordionTrigger>
                        <AccordionContent className={contentClassName}>
                            {item.content}
                        </AccordionContent>
                    </AccordionItem>;
                })
            }
        </Accordion>
    );
};

export default AccordionWrapper;