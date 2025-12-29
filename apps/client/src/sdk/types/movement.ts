import type { Position } from "./position";

export type MoveDir = "N" | "S" | "W" | "E";

export type MoveCommand = {
	reqId: string;
	from: Position;
	dir: MoveDir;
};

export type MoveResult = {
	reqId: string;
	ok: boolean;
	position: Position; // posição autoritativa do "server"
	reason?: string;
};

export type WalkAnim = {
	reqId: string;
	from: Position;
	to: Position;
	startMs: number;
	durationMs: number;
};
