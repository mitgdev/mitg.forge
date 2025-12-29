import type { Application } from "pixi.js";

export function ResizeBridge(args: {
	application: Application;
	element: HTMLElement;
	onResize?: (w: number, h: number) => void; // ex: world.resize
}) {
	const { application, element, onResize } = args;

	let raf: number | null = null;
	let lastWidth = 0;
	let lastHeight = 0;
	let lastDpr = 0;

	const measureAndApply = () => {
		raf = null;

		const rect = element.getBoundingClientRect();
		const width = Math.max(1, Math.round(rect.width));
		const height = Math.max(1, Math.round(rect.height));
		const dpr = window.devicePixelRatio || 1;

		// evita resize repetido (isso é o que mais causa piscar)
		if (width === lastWidth && height === lastHeight && dpr === lastDpr) return;

		lastWidth = width;
		lastHeight = height;
		lastDpr = dpr;

		// se você usa autoDensity+resolution, atualiza DPR também
		application.renderer.resolution = dpr;

		application.renderer.resize(width, height);

		// atualiza seu mundo (scale/offset/hitArea etc)
		onResize?.(width, height);

		// render IMEDIATO (evita 1 frame “limpo”/preto)
		application.render();
	};

	const schedule = () => {
		if (raf !== null) cancelAnimationFrame(raf);
		raf = requestAnimationFrame(measureAndApply);
	};

	schedule(); // initial

	const ro = new ResizeObserver(schedule);
	ro.observe(element);

	return () => {
		ro.disconnect();
		if (raf !== null) cancelAnimationFrame(raf);
	};
}
