import type { ViewportTransform, WorldTile } from "@/sdk/store/viewport";
import { RENDER_PAD } from "../constants";

export function screenToTile(args: {
	localX: number; // dentro do worldEl
	localY: number;
	viewport: ViewportTransform;
}): WorldTile | null {
	const { localX, localY, viewport } = args;
	const pad = RENDER_PAD;

	const {
		offsetX,
		offsetY,
		scale,
		viewW,
		viewH,
		cameraX,
		cameraY,
		tileSize,
		viewTilesX,
		viewTilesY,
		originX,
		originY,
		z,
	} = viewport;

	// 1) -> espaço lógico do rootView (antes do scale)
	const x = (localX - offsetX) / scale;
	const y = (localY - offsetY) / scale;

	// 2) clip 15x11: se tá na borda preta, null
	if (x < 0 || y < 0 || x >= viewW || y >= viewH) return null;

	// 3) desfaz camera scroll (camera move o mundo)
	// screen = camera + worldLocal  => worldLocal = screen - camera
	const worldLocalX = x - cameraX;
	const worldLocalY = y - cameraY;

	// 4) tile indices (com epsilon pra não “pular” por float)
	const eps = 1e-6;
	const vx = Math.floor((worldLocalX + eps) / tileSize);
	const vy = Math.floor((worldLocalY + eps) / tileSize);

	// 5) bounds com PAD (permite pegar tile entrando/saindo no walk scroll)
	const minX = -pad;
	const minY = -pad;
	const maxX = viewTilesX + pad - 1;
	const maxY = viewTilesY + pad - 1;

	if (vx < minX || vy < minY || vx > maxX || vy > maxY) return null;

	return {
		vx,
		vy,
		x: originX + vx,
		y: originY + vy,
		z,
	};
}
