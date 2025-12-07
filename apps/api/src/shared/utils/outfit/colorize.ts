import type { Canvas } from "@napi-rs/canvas";
import { colorizePixel } from "./colorizePixel";

export function colorize(
	template: Canvas,
	canvas: Canvas,
	color: {
		head: number;
		body: number;
		legs: number;
		feet: number;
	},
) {
	const templateContext = template.getContext("2d");
	const templateImageData = templateContext.getImageData(
		0,
		0,
		template.width,
		template.height,
	);
	const templatePixels = templateImageData.data;

	const outfitContext = canvas.getContext("2d");
	const outfitImageData = outfitContext.getImageData(
		0,
		0,
		canvas.width,
		canvas.height,
	);
	const outfitPixels = outfitImageData.data;

	for (let i = 0; i < templatePixels.length; i += 4) {
		const templatePixel =
			(templatePixels[i] << 16) |
			(templatePixels[i + 1] << 8) |
			templatePixels[i + 2];
		const outfitPixel =
			(outfitPixels[i] << 16) |
			(outfitPixels[i + 1] << 8) |
			outfitPixels[i + 2];

		if (templatePixel === outfitPixel) continue;

		const rt = (templatePixel >> 16) & 0xff;
		const gt = (templatePixel >> 8) & 0xff;
		const bt = templatePixel & 0xff;
		let ro = (outfitPixel >> 16) & 0xff;
		let go = (outfitPixel >> 8) & 0xff;
		let bo = outfitPixel & 0xff;

		if (rt && gt && !bt) {
			// yellow == head
			const { r, g, b } = colorizePixel(color.head, ro, go, bo);
			ro = r;
			go = g;
			bo = b;
		} else if (rt && !gt && !bt) {
			// red == body
			const { r, g, b } = colorizePixel(color.body, ro, go, bo);
			ro = r;
			go = g;
			bo = b;
		} else if (!rt && gt && !bt) {
			// green == legs
			const { r, g, b } = colorizePixel(color.legs, ro, go, bo);
			ro = r;
			go = g;
			bo = b;
		} else if (!rt && !gt && bt) {
			// blue == feet
			const { r, g, b } = colorizePixel(color.feet, ro, go, bo);
			ro = r;
			go = g;
			bo = b;
		} else {
			continue;
		}

		outfitPixels[i] = ro;
		outfitPixels[i + 1] = go;
		outfitPixels[i + 2] = bo;
	}

	outfitContext.putImageData(outfitImageData, 0, 0);
}
