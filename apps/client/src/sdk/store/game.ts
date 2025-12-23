import { create } from "zustand";
import type { Position } from "@/sdk/types/position";
import type { Tile } from "@/sdk/types/tile";

export function positionKey(pos: Position): string {
	return `${pos.x}:${pos.y}:${pos.z}`;
}

type GameState = {
	tiles: Map<string, Tile>;
	hoveredTile: Position | null;
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

	moveTarget: null,
	stepDurationMs: 50, // duração de um passo em ms
	stepProgressMs: 0,

	setHoveredTile: (pos: Position | null) => {
		set({ hoveredTile: pos });
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
