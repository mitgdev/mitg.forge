import { GameCanvas } from "@/components/game/Canvas";
import { GameShell } from "@/components/game/Shell";

export const GamePage = () => {
	return (
		<GameShell>
			<GameCanvas />
		</GameShell>
	);
};
