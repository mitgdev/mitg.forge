import { type Position, useWorldStore } from "@/sdk/store/world";
import { demoTileAt } from "./demoTileGen";

const CHUNK = 32;

const chunkKey = (cx: number, cy: number, z: number) => `${cx}:${cy}:${z}`;

function worldToChunk(v: number) {
	// floor pra funcionar com negativos
	return Math.floor(v / CHUNK);
}

export function createDemoMapLoader() {
	const loaded = new Set<string>();

	function ensureChunk(cx: number, cy: number, z: number) {
		const k = chunkKey(cx, cy, z);
		if (loaded.has(k)) return;

		loaded.add(k);

		const patch: Array<{ pos: Position; tile: any }> = [];

		const startX = cx * CHUNK;
		const startY = cy * CHUNK;

		for (let y = startY; y < startY + CHUNK; y++) {
			for (let x = startX; x < startX + CHUNK; x++) {
				patch.push({
					pos: { x, y, z },
					tile: demoTileAt(x, y, z),
				});
			}
		}

		useWorldStore.getState().applyTilePatch(patch);
	}

	/**
	 * Garante que a janela 15×11 (originX/originY) tenha chunks carregados.
	 * “padding” carrega um pouco além pra reduzir pop-in ao andar.
	 */
	function ensureForView(args: {
		originX: number;
		originY: number;
		z: number;
		viewW: number;
		viewH: number;
		paddingTiles?: number;
	}) {
		const { originX, originY, z, viewW, viewH } = args;
		const pad = args.paddingTiles ?? 16;

		const minX = originX - pad;
		const minY = originY - pad;
		const maxX = originX + (viewW - 1) + pad;
		const maxY = originY + (viewH - 1) + pad;

		const cminX = worldToChunk(minX);
		const cminY = worldToChunk(minY);
		const cmaxX = worldToChunk(maxX);
		const cmaxY = worldToChunk(maxY);

		for (let cy = cminY; cy <= cmaxY; cy++) {
			for (let cx = cminX; cx <= cmaxX; cx++) {
				ensureChunk(cx, cy, z);
			}
		}
	}

	return { ensureForView };
}
