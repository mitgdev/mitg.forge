import { useApplication } from "@pixi/react";
import { useEffect } from "react";
import { useDevtoolsStore } from "@/sdk/store/devtools";

export function PixiPerfBridge() {
	const { app } = useApplication();
	const enabled = useDevtoolsStore((s) => s.enabled);
	const setPixi = useDevtoolsStore((s) => s.setPixi);

	useEffect(() => {
		if (!enabled) return;

		let frames = 0;
		let last = performance.now();

		const onTick = () => {
			frames += 1;
		};

		app.ticker.add(onTick);

		const id = window.setInterval(() => {
			const now = performance.now();
			const dt = now - last;
			const fps = dt > 0 ? (frames * 1000) / dt : 0;

			setPixi({
				fps,
				frameMs: app.ticker.deltaMS,
				width: app.renderer.width,
				height: app.renderer.height,
				dpr: app.renderer.resolution,
			});

			frames = 0;
			last = now;
		}, 500);

		return () => {
			window.clearInterval(id);
			app.ticker.remove(onTick);
		};
	}, [app, enabled, setPixi]);

	return null;
}
