// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function hexToRgb(hex: string, alpha?: number) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = (<any>hex.replace)(shorthandRegex, function (m, r, g, b) { return <string>(r + r + g + g + b + b); });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255, alpha || 1];
}

export type IDrawRect = (x0: number, y0: number, x1: number, y1: number, ids: number[], color: number[], activeColor: number[]) => void;

export function rel2abs(rel: number) {
    return (height: number) => Math.ceil(height * rel);
}
