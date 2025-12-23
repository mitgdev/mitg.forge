import { listen } from "@tauri-apps/api/event";
import { useGameStore } from "@/sdk/store/game";

export type Position = { x: number; y: number; z: number };
export type Direction = "north" | "south" | "east" | "west";

export function installMoveListener() {
	return listen("move_result", (event) => {
		useGameStore.getState().onMoveResult(event.payload as any);
	});
}

export function applyDir(p: Position, dir: Direction): Position {
	switch (dir) {
		case "north":
			return { ...p, y: p.y - 1 };
		case "south":
			return { ...p, y: p.y + 1 };
		case "west":
			return { ...p, x: p.x - 1 };
		case "east":
			return { ...p, x: p.x + 1 };
	}
}
