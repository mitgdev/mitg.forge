import type { MoveCommand, MoveDir, MoveResult } from "../types/movement";
import type { Position } from "../types/position";

export type MoveBridge = {
	sendMove: (cmd: MoveCommand) => Promise<MoveResult>;
};

function applyDir(from: Position, dir: MoveDir): Position {
	if (dir === "N") return { ...from, y: from.y - 1 };
	if (dir === "S") return { ...from, y: from.y + 1 };
	if (dir === "W") return { ...from, x: from.x - 1 };
	return { ...from, x: from.x + 1 }; // "E"
}

export function createFakeRustBridge(args?: {
	latencyMs?: number;
	errorRate?: number; // 0..1
}): MoveBridge {
	const latencyMs = args?.latencyMs ?? 30;
	const errorRate = args?.errorRate ?? 0;

	return {
		async sendMove(cmd: MoveCommand): Promise<MoveResult> {
			await new Promise((r) => setTimeout(r, latencyMs));

			const rolledBack = Math.random() < errorRate;

			if (rolledBack) {
				return {
					reqId: cmd.reqId,
					ok: false,
					position: cmd.from, // nega o move
					reason: "simulated_rollback",
				};
			}

			return {
				reqId: cmd.reqId,
				ok: true,
				position: applyDir(cmd.from, cmd.dir),
			};
		},
	};
}

// --- ponte global (pra você trocar por Tauri depois) ---
let bridge: MoveBridge = createFakeRustBridge();

export function setMoveBridge(b: MoveBridge) {
	bridge = b;
}

export function getMoveBridge() {
	return bridge;
}
