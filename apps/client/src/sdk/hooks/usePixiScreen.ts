import { useApplication } from "@pixi/react";
import { useEffect, useState } from "react";

export function usePixiScreen() {
	const { app } = useApplication();
	const [screen, setScreen] = useState(() => ({
		width: app.screen.width,
		height: app.screen.height,
	}));

	useEffect(() => {
		const update = () =>
			setScreen({ width: app.screen.width, height: app.screen.height });

		// Renderer emite resize quando o view muda
		app?.renderer?.on("resize", update);
		update();

		return () => {
			app?.renderer?.off("resize", update);
		};
	}, [app]);

	return screen;
}
