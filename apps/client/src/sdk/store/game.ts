import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";
import type { Position } from "@/sdk/types/position";
import type { Tile } from "@/sdk/types/tile";
import { applyDir, type Direction } from "../movement";

export function positionKey(pos: Position): string {
	return `${pos.x}:${pos.y}:${pos.z}`;
}

type PendingMove = {
	requestId: string;
	prev: Position;
};

type MoveResultEvent = {
	request_id: string;
	ok: boolean;
	position?: Position | null;
	error?: string | null;
};

type GameState = {
	tiles: Map<string, Tile>;
	hoveredTile: Position | null;
	pending: PendingMove | null;
	requestMove: (target: Direction) => void;
	onMoveResult: (event: MoveResultEvent) => void;
	playerPosition: Position;
	moveTarget: Position | null;
	stepDurationMs: number;
	stepProgressMs: number;
	initTestMap: () => void;
	setHoveredTile: (pos: Position | null) => void;
	setMoveTarget: (pos: Position) => void;
	updateMovement: (deltaMs: number) => void;
};

export const useGameStore = create<GameState>((set, get) => ({
	tiles: new Map<string, Tile>(),
	hoveredTile: null,
	playerPosition: { x: 50, y: 50, z: 0 },
	pending: null,

	moveTarget: null,
	stepDurationMs: 50, // duração de um passo em ms
	stepProgressMs: 0,

	setHoveredTile: (pos: Position | null) => {
		set({ hoveredTile: pos });
	},

	requestMove: (direction) => {
		// trava 1 por vez (mais simples). Depois dá pra virar fila.
		if (get().pending) return;

		const prev = get().playerPosition;
		const predicted = applyDir(prev, direction);
		const requestId = crypto.randomUUID();

		// optimistic
		set({ playerPosition: predicted, pending: { requestId, prev } });

		// chama Rust (autoritativo)
		void invoke("request_move", {
			req: {
				request_id: requestId,
				from: prev,
				direction: direction, // snake_case no Rust via serde rename_all
			},
		}).catch((err) => {
			// se der erro no invoke, rollback imediato
			const pending = get().pending;
			if (pending?.requestId === requestId) {
				set({ playerPosition: pending.prev, pending: null });
			}
			console.error("invoke request_move failed:", err);
		});
	},

	onMoveResult: (ev) => {
		const pending = get().pending;
		if (!pending) return;
		if (ev.request_id !== pending.requestId) return; // ignora resposta velha

		if (ev.ok && ev.position) {
			set({ playerPosition: ev.position, pending: null });
		} else {
			// rollback
			set({ playerPosition: pending.prev, pending: null });
		}
	},

	initTestMap: () => {
		const tiles = new Map<string, Tile>();

		for (let y = 0; y < 100; y++) {
			for (let x = 0; x < 100; x++) {
				const pos: Position = { x, y, z: 0 };
				const tile: Tile = { position: pos };
				tiles.set(positionKey(pos), tile);
			}
		}

		set({ tiles: tiles });
	},

	setMoveTarget: (pos: Position) => {
		set({ moveTarget: pos });
	},

	updateMovement: (deltaMs: number) => {
		const state = get();

		const { moveTarget, playerPosition, stepDurationMs } = state;

		if (!moveTarget) return;

		if (
			playerPosition.x === moveTarget.x &&
			playerPosition.y === moveTarget.y &&
			playerPosition.z === moveTarget.z
		) {
			set({ moveTarget: null, stepProgressMs: 0 });
			return;
		}

		let stepProgressMs = state.stepProgressMs + deltaMs;

		if (stepProgressMs < stepDurationMs) {
			// not enough time to move one tile yet
			set({ stepProgressMs });
			return;
		}

		stepProgressMs -= stepDurationMs;

		const dx = moveTarget.x - playerPosition.x;
		const dy = moveTarget.y - playerPosition.y;

		let next: Position = playerPosition;

		if (Math.abs(dx) > 0) {
			next = {
				...playerPosition,
				x: playerPosition.x + Math.sign(dx),
			};
		} else if (Math.abs(dy) > 0) {
			next = {
				...playerPosition,
				y: playerPosition.y + Math.sign(dy),
			};
		}

		set({
			playerPosition: next,
			stepProgressMs,
		});
	},
}));
