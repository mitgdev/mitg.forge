import { GameShell } from "@/components/game/Shell";
import { PointerHoverLayer } from "@/components/PointerHoverLayer";

export function GamePage() {
	return (
		<>
			<GameShell />
			<PointerHoverLayer />
		</>
	);
}
