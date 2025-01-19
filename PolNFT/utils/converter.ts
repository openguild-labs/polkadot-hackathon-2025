import {compactInteger} from "humanize-plus";

export function compactNumber(num: number): string {
    return compactInteger(num, 1) + '+';
}