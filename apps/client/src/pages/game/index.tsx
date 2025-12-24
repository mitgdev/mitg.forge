import { GameShell } from "@/components/game/Shell";
import { usePointerHoverLayer } from "@/sdk/hooks/usePointerHoverLayer";

export function GamePage() {
	usePointerHoverLayer();

	return <GameShell />;
}
