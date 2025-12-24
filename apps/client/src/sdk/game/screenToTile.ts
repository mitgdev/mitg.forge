import type { ViewportTransform, WorldTile } from "@/sdk/store/viewport";

export function screenToTile(args: {
	localX: number; // coordenada dentro do worldEl (DOM)
	localY: number;
	viewport: ViewportTransform;
}): WorldTile | null {
	const { localX, localY, viewport } = args;

	// 1) remove letterbox (offset) e volta pro espaço lógico (antes do scale)
	const x = (localX - viewport.offsetX) / viewport.scale;
	const y = (localY - viewport.offsetY) / viewport.scale;

	// 2) recorte 15x11 (mask). Se estiver na borda preta, null
	if (x < 0 || y < 0 || x >= viewport.viewW || y >= viewport.viewH) return null;

	// 3) desfaz camera scroll (camera move o mundo)
	const worldPxX = x - viewport.cameraX;
	const worldPxY = y - viewport.cameraY;

	const vx = Math.floor(worldPxX / viewport.tileSize);
	const vy = Math.floor(worldPxY / viewport.tileSize);

	if (
		vx < 0 ||
		vy < 0 ||
		vx >= viewport.viewTilesX ||
		vy >= viewport.viewTilesY
	) {
		return null;
	}

	return {
		vx,
		vy,
		x: viewport.originX + vx,
		y: viewport.originY + vy,
		z: viewport.z,
	};
}
