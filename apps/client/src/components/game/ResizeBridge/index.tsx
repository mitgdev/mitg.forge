import { useApplication } from "@pixi/react";
import { useLayoutEffect, useRef } from "react";

export function ResizeBridge({
	resizeTo,
}: {
	resizeTo: React.RefObject<HTMLElement | null>;
}) {
	const { app } = useApplication();
	const last = useRef({ width: 0, height: 0 });
	const raf = useRef<number | null>(null);

	useLayoutEffect(() => {
		const element = resizeTo.current;
		if (!element) return;

		const measureAndApply = () => {
			raf.current = null;

			const width = Math.max(1, element.clientWidth | 0);
			const height = Math.max(1, element.clientHeight | 0);

			if (last.current.width === width && last.current.height === height)
				return;

			last.current = {
				width,
				height,
			};

			app.renderer.resize(width, height);
			app.render();
		};

		const schedule = () => {
			if (raf.current !== null) cancelAnimationFrame(raf.current);
			raf.current = requestAnimationFrame(measureAndApply);
		};

		schedule(); // initial

		const ro = new ResizeObserver(() => schedule());
		ro.observe(element);

		return () => {
			ro.disconnect();
			if (raf.current !== null) cancelAnimationFrame(raf.current);
		};
	}, [app, resizeTo]);

	return null;
}
