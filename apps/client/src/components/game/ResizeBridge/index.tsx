import { useApplication } from "@pixi/react";
import { useLayoutEffect } from "react";

export function ResizeBridge({
	resizeTo,
}: {
	resizeTo: React.RefObject<HTMLElement | null>;
}) {
	const { app } = useApplication();

	useLayoutEffect(() => {
		const element = resizeTo.current;
		if (!element) return;

		const apply = () => {
			const w = Math.max(1, element.clientWidth);
			const h = Math.max(1, element.clientHeight);
			app.renderer.resize(w, h);
		};

		apply(); // resize inicial

		const ro = new ResizeObserver(() => apply());
		ro.observe(element);

		return () => ro.disconnect();
	}, [app, resizeTo]);

	return null;
}
