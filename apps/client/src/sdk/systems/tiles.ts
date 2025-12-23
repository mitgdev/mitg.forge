import { VIEW_TILES_X, VIEW_TILES_Y } from "@/sdk/constants";
import type { Position } from "@/sdk/types/position";
import type { Tile } from "@/sdk/types/tile";

export function getViewTiles(
	playerPosition: Position,
	tiles: Map<string, Tile>,
) {
	const halfViewX = Math.floor(VIEW_TILES_X / 2);
	const halfViewY = Math.floor(VIEW_TILES_Y / 2);

	const startX = playerPosition.x - halfViewX;
	const startY = playerPosition.y - halfViewY;

	const result: Tile[] = [];
	for (let vy = 0; vy < VIEW_TILES_Y; vy++) {
		for (let vx = 0; vx < VIEW_TILES_X; vx++) {
			const x = startX + vx;
			const y = startY + vy;
			const pos: Position = { x, y, z: playerPosition.z };
			const key = `${x}:${y}:${playerPosition.z}`;
			result.push(tiles.get(key) ?? { position: pos });
		}
	}
	return result;
}
