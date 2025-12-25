import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { MoveBridge } from "@/sdk/movement/bridge";
import type { MoveCommand, MoveResult } from "@/sdk/types/movement";
import type { GameEvent } from "../game/events";

const pending = new Map<
	string,
	{
		resolve: (r: MoveResult) => void;
		reject: (e: unknown) => void;
		timeoutId: number;
	}
>();

let started = false;

async function ensureListener() {
	if (started) return;
	started = true;

	await listen<GameEvent>("game:event", (e) => {
		if (e.payload.type !== "MoveResult") return;

		const res = e.payload.data;
		const p = pending.get(res.reqId);
		if (!p) return;

		clearTimeout(p.timeoutId);
		pending.delete(res.reqId);
		p.resolve(res);
	});
}

export function createTauriMoveBridge(): MoveBridge {
	return {
		async sendMove(cmd: MoveCommand): Promise<MoveResult> {
			await ensureListener();

			return new Promise<MoveResult>((resolve, reject) => {
				const timeoutId = window.setTimeout(() => {
					pending.delete(cmd.reqId);
					reject(new Error("move timeout"));
				}, 2000);

				pending.set(cmd.reqId, { resolve, reject, timeoutId });

				invoke("game_command", {
					command: { type: "Move", data: cmd },
				}).catch((err) => {
					const p = pending.get(cmd.reqId);
					if (p) {
						clearTimeout(p.timeoutId);
						pending.delete(cmd.reqId);
					}
					reject(err);
				});
			});
		},
	};
}
