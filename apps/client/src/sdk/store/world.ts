import { create } from "zustand";

export type Position = {
	x: number;
	y: number;
	z: number;
};

export type Tile = {
	groundTint?: number;
	groundTexture?: string; // atlas id
};

export type Creature = {
	id: string;
	position: Position;
	texture?: string; // atlas id
};

type State = {
	worldElement: HTMLElement | null;
	setWorldElement: (el: HTMLElement | null) => void;

	tiles: Map<string, Tile>;
	tilesVersion: number;

	creatures: Map<string, Creature>;
	creaturesVersion: number;

	applyTilePatch: (patch: Array<{ pos: Position; tile: Tile | null }>) => void;
	applyCreaturePatch: (
		patch: Array<{ id: string; creature: Creature | null }>,
	) => void;
};

export const makeKeyFromPosition = (p: Position) => `${p.x}:${p.y}:${p.z}`;

export const useWorldStore = create<State>((set) => ({
	worldElement: null,
	tiles: new Map<string, Tile>([]),
	tilesVersion: 0,

	creatures: new Map<string, Creature>([]),
	creaturesVersion: 0,

	setWorldElement: (el) => set({ worldElement: el }),

	applyTilePatch: (patch) =>
		set((s) => {
			const next = new Map(s.tiles);
			for (const { pos, tile } of patch) {
				const key = makeKeyFromPosition(pos);
				if (!tile) next.delete(key);
				else next.set(key, tile);
			}
			return { tiles: next, tilesVersion: s.tilesVersion + 1 };
		}),

	applyCreaturePatch: (patch) =>
		set((s) => {
			const next = new Map(s.creatures);
			for (const { id, creature } of patch) {
				if (!creature) next.delete(id);
				else next.set(id, creature);
			}
			return { creatures: next, creaturesVersion: s.creaturesVersion + 1 };
		}),
}));
