import { create } from "zustand";

type Player = { tx: number; ty: number };
type Camera = { cx: number; cy: number };

type Destination = { tx: number; ty: number } | null;

type GameState = {
	tileSize: number;
	worldWidth: number;
	worldHeight: number;
	viewWidth: number;
	viewHeight: number;

	player: Player;
	camera: Camera;

	zoom: number;

	destination: Destination;

	setDestination: (tx: number, ty: number) => void;
	clearDestination: () => void;

	movePlayer: (dx: number, dy: number) => void;
	stepTowardsDestination: () => void;
};

function clamp(v: number, min: number, max: number) {
	return Math.min(max, Math.max(min, v));
}

export const useGameStore = create<GameState>((set, get) => ({
	tileSize: 32,
	worldWidth: 100,
	worldHeight: 100,
	viewWidth: 15,
	viewHeight: 11,

	player: { tx: 50, ty: 50 },
	camera: {
		cx: 50 - Math.floor(15 / 2),
		cy: 50 - Math.floor(11 / 2),
	},

	zoom: 1,

	destination: null,

	setDestination: (tx, ty) => {
		set({ destination: { tx, ty } });
	},

	clearDestination: () => {
		set({ destination: null });
	},

	// anda 1 tile (dx,dy), atualiza camera igual de antes
	movePlayer: (dx, dy) => {
		const state = get();
		const { worldWidth, worldHeight, viewWidth, viewHeight, player } = state;

		const tx = clamp(player.tx + dx, 0, worldWidth - 1);
		const ty = clamp(player.ty + dy, 0, worldHeight - 1);

		const halfW = Math.floor(viewWidth / 2);
		const halfH = Math.floor(viewHeight / 2);

		let cx = tx - halfW;
		let cy = ty - halfH;

		const maxCx = Math.max(0, worldWidth - viewWidth);
		const maxCy = Math.max(0, worldHeight - viewHeight);

		cx = clamp(cx, 0, maxCx);
		cy = clamp(cy, 0, maxCy);

		set({
			player: { tx, ty },
			camera: { cx, cy },
		});
	},

	// anda 1 tile em direção ao destino (sem pathfinding, só linha “quebrada”)
	stepTowardsDestination: () => {
		const { destination, player, movePlayer, clearDestination } = get();
		if (!destination) return;

		const { tx: ptx, ty: pty } = player;
		const { tx: dtx, ty: dty } = destination;

		// já chegou
		if (ptx === dtx && pty === dty) {
			clearDestination();
			return;
		}

		let dx = 0;
		let dy = 0;

		// anda no eixo X primeiro
		if (dtx > ptx) dx = 1;
		else if (dtx < ptx) dx = -1;
		// se X já está alinhado, anda no Y
		else if (dty > pty) dy = 1;
		else if (dty < pty) dy = -1;

		movePlayer(dx, dy);

		// se chegou no destino depois do passo, limpa
		const newPlayer = get().player;
		if (newPlayer.tx === dtx && newPlayer.ty === dty) {
			clearDestination();
		}
	},
}));
