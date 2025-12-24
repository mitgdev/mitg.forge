import { create } from "zustand";

export type WorldTile = {
	vx: number; // 0..VIEW_TILES_X-1
	vy: number; // 0..VIEW_TILES_Y-1
	x: number; // world tile
	y: number; // world tile
	z: number;
};

export type ViewportTransform = {
	// tamanho do container/canvas (px DOM)
	stageWidth: number;
	stageHeight: number;

	// rootView (letterbox)
	scale: number;
	offsetX: number; // px DOM dentro do container
	offsetY: number;

	// camera (walk scroll) em px lógicos (antes do scale)
	cameraX: number;
	cameraY: number;

	// janela visível (15x11) no mundo
	originX: number;
	originY: number;
	z: number;

	// dimensões lógicas do viewport visível (antes do scale)
	viewW: number; // VIEW_TILES_X * TILE_SIZE_PX
	viewH: number; // VIEW_TILES_Y * TILE_SIZE_PX
	viewTilesX: number; // VIEW_TILES_X
	viewTilesY: number; // VIEW_TILES_Y
	tileSize: number; // TILE_SIZE_PX
};

type State = {
	viewport: ViewportTransform | null;
	setViewport: (v: ViewportTransform) => void;
	patchViewport: (patch: Partial<ViewportTransform>) => void;

	hoveredTile: WorldTile | null;
	setHoveredTile: (t: WorldTile | null) => void;
};

export const useViewportStore = create<State>((set, get) => ({
	viewport: null,
	setViewport: (v) => set({ viewport: v }),
	patchViewport: (patch) => {
		const vp = get().viewport;
		if (!vp) return;
		const next = { ...vp, ...patch };
		set({ viewport: next });
	},

	hoveredTile: null,
	setHoveredTile: (t) => set({ hoveredTile: t }),
}));
