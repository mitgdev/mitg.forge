import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useCallback, useEffect } from "react";
import { GameShell } from "@/components/game/Shell";
import { PerfOverlay } from "@/components/performance/Overlay";
import { ReactPerfProfiler } from "@/components/performance/Profiler";
import { WidgetDragGhost } from "@/components/Widgets/Ghost";
import type { GameEvent } from "@/sdk/game/events";
import { useDragControllerLayer } from "@/sdk/hooks/useDragControllerLayer";
import { usePointerHoverLayer } from "@/sdk/hooks/usePointerHoverLayer";
import { setMoveBridge } from "@/sdk/movement/bridge";
import { createTauriMoveBridge } from "@/sdk/movement/bridge.tauri";
import { startMovementInput } from "@/sdk/movement/movementInput";
import { useMovementStore } from "@/sdk/store/movement";

export function GamePage() {
	usePointerHoverLayer();
	useDragControllerLayer();

	useEffect(() => {
		console.log("Setting Tauri Move Bridge");
		setMoveBridge(createTauriMoveBridge());
	}, []);

	useEffect(() => {
		const stop = startMovementInput();
		return () => stop();
	}, []);

	useEffect(() => {
		const unlisten = listen<GameEvent>("game:event", (e) => {
			const ev = e.payload;

			if (ev.type === "PlayerPosition") {
				useMovementStore.getState().setPlayerTile(ev.data);
				return;
			}

			console.log("EVENT:", ev.type, ev.data);
		});

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	const handleLogin = useCallback(async () => {
		await invoke("game_connect", {
			ip: "10.1.1.251",
			port: 7172,
			sessionKey: "god@god.com\ngod",
			characterName: "GOD",
		});
	}, []);

	const handleLogger = useCallback(async () => {
		await invoke("game_command", {
			command: { type: "Log", data: { message: "oi worker" } },
		});
	}, []);

	const handleDisconnect = useCallback(async () => {
		await invoke("game_disconnect");
	}, []);

	const sendRawDataXtea = useCallback(async () => {
		const payload = Array.from(new TextEncoder().encode("ping"));
		await invoke("game_command", {
			command: { type: "SendRaw", data: { payload } },
		});
	}, []);

	return (
		<>
			<div className="absolute top-1 right-1 flex flex-row gap-1">
				<button
					type="button"
					className="rounded bg-blue-500 p-2 text-white"
					onClick={sendRawDataXtea}
				>
					Send Xtea
				</button>
				<button
					type="button"
					className="rounded bg-blue-500 p-2 text-white"
					onClick={handleLogin}
				>
					Login
				</button>
				<button
					type="button"
					className="rounded bg-blue-500 p-2 text-white"
					onClick={handleLogger}
				>
					Logger
				</button>
				<button
					type="button"
					className="rounded bg-blue-500 p-2 text-white"
					onClick={handleDisconnect}
				>
					Disconnect
				</button>
			</div>

			<ReactPerfProfiler id="root">
				<GameShell />
				<WidgetDragGhost />
			</ReactPerfProfiler>
			<PerfOverlay />
		</>
	);
}
