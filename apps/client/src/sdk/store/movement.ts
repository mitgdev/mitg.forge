import { create } from "zustand";

export type Position = { x: number; y: number; z: number };

export type WalkAnim = {
	from: Position;
	to: Position;
	startMs: number;
	durationMs: number;
};

type State = {
	playerTile: Position;
	walkAnim: WalkAnim | null;

	// esses 2 são chamados pelo handler do evento do Rust:
	startWalkAnim: (from: Position, to: Position, durationMs: number) => void;
	commitPlayerTile: (to: Position) => void;
};

export const useMovementStore = create<State>((set) => ({
	playerTile: { x: 50, y: 50, z: 0 },
	walkAnim: null,

	startWalkAnim: (from, to, durationMs) =>
		set({ walkAnim: { from, to, startMs: performance.now(), durationMs } }),

	commitPlayerTile: (to) => set({ playerTile: to, walkAnim: null }),
}));
