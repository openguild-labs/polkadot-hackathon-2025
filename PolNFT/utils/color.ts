// @ts-ignore
import {LightenDarkenColor} from 'lighten-darken-color';

export function lightenDarkenColor(color: string, amount: number): string {
    const res: string = LightenDarkenColor(color, amount);
    return res[0] === '#' ? res : `#${res}`;
}
