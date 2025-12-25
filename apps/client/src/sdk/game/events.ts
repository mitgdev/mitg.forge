import type { MoveResult } from "../types/movement";
import type { Position } from "../types/position";

export type GameEvent =
	| { type: "Log"; data: { level: string; message: string; tsMs: number } }
	| { type: "State"; data: { state: string } }
	| { type: "Tick"; data: { n: number; tsMs: number } }
	| { type: "PlayerPosition"; data: Position }
	| { type: "MoveResult"; data: MoveResult };
