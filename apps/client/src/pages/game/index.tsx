import { useEffect } from "react";
import { GameShell } from "@/components/game/Shell";
import { PerfOverlay } from "@/components/performance/Overlay";
import { ReactPerfProfiler } from "@/components/performance/Profiler";
import { WidgetDragGhost } from "@/components/Widgets/Ghost";
import { useDragControllerLayer } from "@/sdk/hooks/useDragControllerLayer";
import { usePointerHoverLayer } from "@/sdk/hooks/usePointerHoverLayer";
import { startMovementInput } from "@/sdk/movement/movementInput";

export function GamePage() {
	usePointerHoverLayer();
	useDragControllerLayer();

	useEffect(() => {
		const stop = startMovementInput();
		return () => stop();
	}, []);

	return (
		<>
			<ReactPerfProfiler id="root">
				<GameShell />
				<WidgetDragGhost />
			</ReactPerfProfiler>
			<PerfOverlay />
		</>
	);
}
