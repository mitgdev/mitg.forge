import type * as PIXI from "pixi.js";
import type { Application } from "pixi.js";
import { usePerfStore } from "@/sdk/store/performance";

export function attachPixiPerf(app: Application) {
	let lastUpdate = performance.now();
	let frames = 0;
	let accDelta = 0;

	const intervalMs = 250;

	const tick = (t: PIXI.Ticker) => {
		const deltaMS =
			typeof t?.deltaMS === "number"
				? t.deltaMS
				: typeof t === "number"
					? t * (1000 / 60)
					: 16.6667;

		frames += 1;
		accDelta += deltaMS;

		const now = performance.now();
		if (now - lastUpdate < intervalMs) return;

		const elapsed = now - lastUpdate;
		const fps = (frames * 1000) / Math.max(1, elapsed);
		const frameMs = accDelta / Math.max(1, frames);

		usePerfStore.getState().setPixi({
			fps,
			frameMs,
			screenW: app.screen.width,
			screenH: app.screen.height,
			resolution: app.renderer.resolution ?? window.devicePixelRatio ?? 1,
		});

		frames = 0;
		accDelta = 0;
		lastUpdate = now;
	};

	app.ticker.add(tick);
	return () => app.ticker.remove(tick);
}
