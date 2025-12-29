import type { Tile } from "@/sdk/store/world";

// hash simples determinístico
function hash2(x: number, y: number, z: number) {
	let h = 2166136261;
	h = (h ^ (x * 73856093)) >>> 0;
	h = (h ^ (y * 19349663)) >>> 0;
	h = (h ^ (z * 83492791)) >>> 0;
	h = Math.imul(h, 16777619) >>> 0;
	return h;
}

export function demoTileAt(x: number, y: number, z: number): Tile {
	const h = hash2(x, y, z);

	// 3 “biomas” só pra ficar visual
	const band = h % 3;

	let tint = 0x3b4048; // default
	if (band === 0) tint = 0x2f3640;
	if (band === 1) tint = 0x40586b;
	if (band === 2) tint = 0x4b514a;

	// estradas (linhas) pra dar referência visual
	if (x % 10 === 0 || y % 10 === 0) tint = 0x6b6f76;

	// “água” em manchas
	if (h % 37 === 0) tint = 0x234b8a;

	return { groundTint: tint };
}
