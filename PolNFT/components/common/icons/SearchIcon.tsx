import { THEME } from "@/styles/theme";
import { IconProps } from "./IconProps";

export default function SearchIcon({
    size,
    color,
    className
}: IconProps) {
    return (
        <svg
            viewBox="0 0 16 16"
            width={size ?? 20}
            height={size ?? 20}
            fill={color ?? THEME.ROYAL_GRAY_COLOR}
            className={className}
        >
            <path d="M7.333 1.333a6 6 0 0 1 6 6c0 1.417-.491 2.719-1.312 3.745h0l1.783 1.783c.26.26.26.682 0 .943s-.682.26-.943 0h0l-1.783-1.783c-1.026.821-2.328 1.312-3.745 1.312a6 6 0 1 1 0-12zm0 1.333a4.67 4.67 0 0 0-4.667 4.667A4.67 4.67 0 0 0 7.333 12 4.67 4.67 0 0 0 12 7.333a4.67 4.67 0 0 0-4.667-4.667z"></path>
        </svg>


    )
}
