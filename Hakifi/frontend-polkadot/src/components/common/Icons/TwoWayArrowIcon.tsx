import colors from "@/colors";
import React, { useMemo } from "react";

const TwoWayArrowIcon = ({ sort, ...props }: { sort?: boolean | string; } & React.SVGProps<SVGSVGElement>) => {
    const color = useMemo(() => {
        switch (sort) {
            case false:
                return {
                    up: colors.typo.secondary,
                    down: colors.typo.accent,
                };
            case true:
                return {
                    up: colors.typo.accent,
                    down: colors.typo.secondary,
                };

            default:
                return {
                    up: colors.typo.secondary,
                    down: colors.typo.secondary,
                };
        }
    }, [sort]);


    return (
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M4.42354 0.599076C4.73826 0.27201 5.26174 0.27201 5.57646 0.599077L8.02657 3.1453C8.51562 3.65354 8.15543 4.5 7.4501 4.5L2.5499 4.5C1.84457 4.5 1.48438 3.65354 1.97343 3.1453L4.42354 0.599076Z" fill={color.up} />
            <path d="M4.42354 11.4009C4.73826 11.728 5.26174 11.728 5.57646 11.4009L8.02657 8.8547C8.51562 8.34646 8.15543 7.5 7.4501 7.5L2.5499 7.5C1.84457 7.5 1.48438 8.34646 1.97343 8.8547L4.42354 11.4009Z" fill={color.down} />
        </svg>
    );
};

export default TwoWayArrowIcon;
