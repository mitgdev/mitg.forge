import { outfitColors } from "./colors";

export function colorizePixel(color: number, r: number, g: number, b: number) {
	let value: number;
	if (color < outfitColors.length) value = outfitColors[color];
	else value = 0;
	const ro = (value & 0xff0000) >> 16; // rgb outfit
	const go = (value & 0xff00) >> 8;
	const bo = value & 0xff;
	const localR = Math.floor(r * (ro / 255));
	const localG = Math.floor(g * (go / 255));
	const localB = Math.floor(b * (bo / 255));
	return { r: localR, g: localG, b: localB };
}
