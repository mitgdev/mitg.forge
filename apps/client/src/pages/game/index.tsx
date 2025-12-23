import { DragControllerLayer } from "@/components/DragControllerLayer";
import { GameCanvas } from "@/components/game/Canvas";
import { GameShell } from "@/components/game/Shell";
import "@/sdk/drag/setupRules"; // registra rules (import side effect)
import { useEffect } from "react";
import { DevtoolsOverlay } from "@/components/dev/DevtoolsOverlay";
import { ReactPerfProfiler } from "@/components/dev/ReactPerfProfiler";
import { installMoveListener } from "@/sdk/movement";

export const GamePage = () => {
	useEffect(() => {
		const unlistenPromise = installMoveListener();

		return () => {
			void unlistenPromise.then((u) => u());
		};
	}, []);

	return (
		<ReactPerfProfiler>
			<GameShell>
				<GameCanvas />
				<DragControllerLayer />
			</GameShell>
			<DevtoolsOverlay />
		</ReactPerfProfiler>
	);
};
