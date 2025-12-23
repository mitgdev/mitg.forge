import { DragControllerLayer } from "@/components/DragControllerLayer";
import { GameCanvas } from "@/components/game/Canvas";
import { GameShell } from "@/components/game/Shell";
import "@/sdk/drag/setupRules"; // registra rules (import side effect)

export const GamePage = () => {
	return (
		<GameShell>
			<GameCanvas />
			<DragControllerLayer />
		</GameShell>
	);
};
