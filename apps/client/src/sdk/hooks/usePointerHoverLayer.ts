import { useEffect } from "react";
import { screenToTile } from "@/sdk/game/screenToTile";
import { useViewportStore } from "@/sdk/store/viewport";
import { useWorldStore } from "@/sdk/store/world";

export function usePointerHoverLayer() {
	const viewport = useViewportStore((state) => state.viewport);
	const setHoveredTile = useViewportStore((state) => state.setHoveredTile);
	const worldElement = useWorldStore((state) => state.worldElement);

	useEffect(() => {
		const onMove = (e: PointerEvent) => {
			if (!worldElement || !viewport) return;

			const rect = worldElement.getBoundingClientRect();
			const localX = e.clientX - rect.left;
			const localY = e.clientY - rect.top;

			const tile = screenToTile({ localX, localY, viewport });

			setHoveredTile(tile);
		};

		const onLeave = () => setHoveredTile(null);

		window.addEventListener("pointermove", onMove, { passive: true });
		window.addEventListener("blur", onLeave);

		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("blur", onLeave);
		};
	}, [worldElement, viewport, setHoveredTile]);
}
