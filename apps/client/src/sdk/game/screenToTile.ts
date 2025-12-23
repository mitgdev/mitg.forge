import type { DragViewportTransform, WorldTile } from "@/sdk/drag/types";
import { TILE_SIZE_PX, VIEW_TILES_X, VIEW_TILES_Y } from "../constants";

export function screenToTile(args: {
	localX: number;
	localY: number;
	viewport: DragViewportTransform;
	player: { x: number; y: number; z: number };
}): WorldTile | null {
	const { localX, localY, viewport, player } = args;
	const { scale, offsetX, offsetY } = viewport;

	const logicalW = VIEW_TILES_X * TILE_SIZE_PX;
	const logicalH = VIEW_TILES_Y * TILE_SIZE_PX;

	const mapLeft = offsetX;
	const mapTop = offsetY;
	const mapRight = offsetX + logicalW * scale;
	const mapBottom = offsetY + logicalH * scale;

	if (
		localX < mapLeft ||
		localX >= mapRight ||
		localY < mapTop ||
		localY >= mapBottom
	) {
		return null; // borda preta
	}

	const worldPxX = (localX - offsetX) / scale;
	const worldPxY = (localY - offsetY) / scale;

	const vx = Math.floor(worldPxX / TILE_SIZE_PX);
	const vy = Math.floor(worldPxY / TILE_SIZE_PX);

	if (vx < 0 || vy < 0 || vx >= VIEW_TILES_X || vy >= VIEW_TILES_Y) return null;

	const halfX = Math.floor(VIEW_TILES_X / 2);
	const halfY = Math.floor(VIEW_TILES_Y / 2);
	const originX = player.x - halfX;
	const originY = player.y - halfY;

	return { vx, vy, x: originX + vx, y: originY + vy, z: player.z };
}
