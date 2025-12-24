import { Application, TextureStyle } from "pixi.js";
import { useEffect, useRef } from "react";
import { ResizeBridge } from "@/sdk/pixi/utils/ResizeBridge";
import { World } from "@/sdk/pixi/world";

export function PixiHost() {
	const hostRef = useRef<HTMLDivElement>(null);
	const bootTokenRef = useRef(0);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;

		// invalida boots anteriores
		bootTokenRef.current += 1;
		const token = bootTokenRef.current;

		let ro: ResizeObserver | null = null;
		let application: Application | null = null;
		let world: World | null = null;

		// garante que não ficou canvas “antigo” no DOM
		host.replaceChildren();

		const cleanup = () => {
			ro?.disconnect();
			ro = null;

			world?.destroy();
			world = null;

			// remove canvas do DOM também (não confia só no destroy)
			if (application) {
				try {
					application.destroy();
				} finally {
					application = null;
				}
			}

			// limpa o host (remove canvas caso ainda exista)
			host.replaceChildren();
		};

		(async () => {
			TextureStyle.defaultOptions.scaleMode = "nearest";

			application = new Application();

			await application.init({
				backgroundAlpha: 0,
				antialias: false,
				autoDensity: true,
				roundPixels: false,
				resolution: window.devicePixelRatio,
				sharedTicker: true,
				powerPreference: "high-performance",
				preference: "webgpu",
			});

			application.canvas.style.display = "block";

			// se rolou HMR/StrictMode/cleanup enquanto init rodava, aborta
			if (bootTokenRef.current !== token) {
				application.destroy();
				return;
			}

			// garante que só existe um canvas
			host.replaceChildren(application.canvas);

			world = new World(application);

			ResizeBridge({
				application: application,
				element: host, // a div container (ref.current)
				onResize: (width, height) => {
					world?.resize(width, height);
				},
			});

			application.ticker.add((t) => {
				world?.update(performance.now(), t.deltaMS);
			});
		})();

		// ✅ Vite: quando o módulo for substituído via HMR, roda cleanup
		if (import.meta.hot) {
			import.meta.hot.dispose(() => {
				// invalida token e limpa
				bootTokenRef.current += 1;
				cleanup();
			});
		}

		return () => {
			// invalida esse boot e limpa
			bootTokenRef.current += 1;

			cleanup();
		};
	}, []);

	return (
		<div
			ref={hostRef}
			className="relative h-full min-h-0 w-full min-w-0 overflow-hidden"
		/>
	);
}
