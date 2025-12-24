import { GameShell } from "@/components/game/Shell";
import { WidgetDragGhost } from "@/components/Widgets/Ghost";
import { useDragControllerLayer } from "@/sdk/hooks/useDragControllerLayer";
import { usePointerHoverLayer } from "@/sdk/hooks/usePointerHoverLayer";

export function GamePage() {
	usePointerHoverLayer();
	useDragControllerLayer();

	return (
		<>
			<GameShell />
			<WidgetDragGhost />
		</>
	);
}
