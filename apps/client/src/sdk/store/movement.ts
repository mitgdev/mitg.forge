import { create } from "zustand";
import { TILE_SIZE_PX } from "@/sdk/constants";
import { getMoveBridge } from "@/sdk/movement/bridge";
import type { MoveDir, MoveResult, WalkAnim } from "../types/movement";
import type { Position } from "../types/position";

const WALK_DURATION_MS = 20; // tempo do walk tile-to-tile
const ROLLBACK_DURATION_MS = 90; // tempo do “snap back” suave
const QUEUE_MAX = 2; // OTClient-like (buffer pequeno)

function uuid() {
	return (
		globalThis.crypto?.randomUUID?.() ??
		`req_${Math.random().toString(16).slice(2)}`
	);
}

function applyDir(from: Position, dir: MoveDir): Position {
	if (dir === "N") return { ...from, y: from.y - 1 };
	if (dir === "S") return { ...from, y: from.y + 1 };
	if (dir === "W") return { ...from, x: from.x - 1 };
	return { ...from, x: from.x + 1 };
}

function sameTile(a: Position, b: Position) {
	return a.x === b.x && a.y === b.y && a.z === b.z;
}

type Pending = {
	from: Position;
	expectedTo: Position;
	dir: MoveDir;
};

type RollbackAnim = {
	startMs: number;
	durationMs: number;
	fromCamX: number;
	fromCamY: number;
};

type MovementState = {
	playerTile: Position;

	// câmera em px “lógico” (antes do scale)
	cameraPx: { x: number; y: number };

	// animação atual (map scroll)
	walkAnim: WalkAnim | null;

	// rollback suave (quando server nega)
	rollbackAnim: RollbackAnim | null;

	// input buffer
	queue: MoveDir[];

	// tracking de requests
	pendingByReq: Record<string, Pending>;

	enqueueMove: (dir: MoveDir) => void;
	tick: (nowMs: number) => void;

	onServerMoveResult: (res: MoveResult, nowMs: number) => void;

	setPlayerTile: (t: Position) => void;
};

export const useMovementStore = create<MovementState>((set, get) => ({
	playerTile: { x: 50, y: 50, z: 0 },

	cameraPx: { x: 0, y: 0 },

	walkAnim: null,
	rollbackAnim: null,

	queue: [],
	pendingByReq: {},

	setPlayerTile: (t) => set({ playerTile: t }),

	enqueueMove: (dir) => {
		const s = get();

		// se está em rollback, só bufferiza
		if (s.rollbackAnim) {
			if (s.queue.length < QUEUE_MAX) set({ queue: [...s.queue, dir] });
			return;
		}

		// se já está andando, bufferiza
		if (s.walkAnim) {
			if (s.queue.length >= QUEUE_MAX) return;
			set({ queue: [...s.queue, dir] });
			return;
		}

		// se está idle, começa já
		startMove(dir);
	},

	tick: (nowMs) => {
		const s = get();

		// 1) rollback suave tem prioridade
		if (s.rollbackAnim) {
			const r = s.rollbackAnim;
			const t = Math.max(0, Math.min(1, (nowMs - r.startMs) / r.durationMs));

			// interp linear até 0
			const camX = r.fromCamX * (1 - t);
			const camY = r.fromCamY * (1 - t);

			set({ cameraPx: { x: camX, y: camY } });

			if (t >= 1) {
				set({ rollbackAnim: null, cameraPx: { x: 0, y: 0 } });

				// terminou rollback: se tiver fila, começa o próximo já
				const after = get();
				if (!after.walkAnim && after.queue.length > 0) {
					const [dir, ...rest] = after.queue;
					set({ queue: rest });
					startMove(dir);
				}
			}
			return;
		}

		// 2) walk normal
		if (s.walkAnim) {
			const anim = s.walkAnim;
			const t = Math.max(
				0,
				Math.min(1, (nowMs - anim.startMs) / anim.durationMs),
			);

			const dx = anim.to.x - anim.from.x;
			const dy = anim.to.y - anim.from.y;

			// scroll oposto do movimento (OTClient)
			const camX = -dx * TILE_SIZE_PX * t;
			const camY = -dy * TILE_SIZE_PX * t;

			set({ cameraPx: { x: camX, y: camY } });

			if (t >= 1) {
				// commit do tile no fim
				set({ playerTile: anim.to, walkAnim: null, cameraPx: { x: 0, y: 0 } });

				// start next from queue imediatamente
				const after = get();
				if (after.queue.length > 0) {
					const [dir, ...rest] = after.queue;
					set({ queue: rest });
					startMove(dir);
				}
			}
			return;
		}

		// 3) idle
		if (s.cameraPx.x !== 0 || s.cameraPx.y !== 0) {
			set({ cameraPx: { x: 0, y: 0 } });
		}

		// se idle e tem fila (caso raro), start
		if (s.queue.length > 0) {
			const [dir, ...rest] = s.queue;
			set({ queue: rest });
			startMove(dir);
		}
	},

	onServerMoveResult: (res, nowMs) => {
		const s = get();
		const pending = s.pendingByReq[res.reqId];
		if (!pending) return;

		// remove pending
		const nextPending = { ...s.pendingByReq };
		delete nextPending[res.reqId];

		// caso: server negou -> rollback suave + cancela walk
		if (!res.ok) {
			const fromCam = s.cameraPx;

			set({
				pendingByReq: nextPending,

				// cancela walk e limpa buffer (opcional, OTClient costuma limpar)
				walkAnim: null,
				queue: [],

				// volta pro tile autoritativo (geralmente pending.from)
				playerTile: res.position,

				// inicia rollback anim da câmera atual até 0
				rollbackAnim: {
					startMs: nowMs,
					durationMs: ROLLBACK_DURATION_MS,
					fromCamX: fromCam.x,
					fromCamY: fromCam.y,
				},
			});

			return;
		}

		// server ok: se posição autoritativa diferente da esperada -> correction
		// (em protótipo: snap tile + zera câmera; é o mais seguro)
		if (!sameTile(res.position, pending.expectedTo)) {
			set({
				pendingByReq: nextPending,
				walkAnim: null,
				queue: [],
				playerTile: res.position,
				cameraPx: { x: 0, y: 0 },
				rollbackAnim: null,
			});
			return;
		}

		// ok e bateu: só confirma pending, animação segue normal
		set({ pendingByReq: nextPending });
	},
}));

function startMove(dir: MoveDir) {
	const nowMs = performance.now();
	const s = useMovementStore.getState();

	const from = s.playerTile;
	const to = applyDir(from, dir);
	const reqId = uuid();

	useMovementStore.setState({
		walkAnim: {
			reqId,
			from,
			to,
			startMs: nowMs,
			durationMs: WALK_DURATION_MS,
		},
		pendingByReq: {
			...s.pendingByReq,
			[reqId]: { from, expectedTo: to, dir },
		},
	});

	getMoveBridge()
		.sendMove({ reqId, from, dir })
		.then((res) =>
			useMovementStore.getState().onServerMoveResult(res, performance.now()),
		)
		.catch(() => {
			useMovementStore
				.getState()
				.onServerMoveResult(
					{ reqId, ok: false, position: from, reason: "bridge_error" },
					performance.now(),
				);
		});
}
