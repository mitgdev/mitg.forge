import { create } from "zustand";

type PixiPerf = {
	fps: number;
	frameMs: number;
	screenW: number;
	screenH: number;
	resolution: number;
};

type ReactPerf = {
	lastCommitMs: number;
	avgCommitMs: number;
	commitsPerSec: number;
};

type WorldPerf = {
	worldAvgMs: number;
	worldMaxMs: number;

	groundAvgMs: number;
	groundMaxMs: number;

	creaturesAvgMs: number;
	creaturesMaxMs: number;

	overlayAvgMs: number;
	overlayMaxMs: number;

	debugAvgMs: number;
	debugMaxMs: number;
};

type Counters = {
	groundSprites: number;
	creaturesTotal: number;
	creaturesVisible: number;
	tilesInCache: number;

	// opcional
	viewDirty: boolean;
	tilesDirty: boolean;
	creaturesDirty: boolean;
};

type PerfState = {
	enabled: boolean;
	toggle: () => void;
	setEnabled: (v: boolean) => void;

	pixi: PixiPerf;
	setPixi: (p: Partial<PixiPerf>) => void;

	react: ReactPerf;
	pushReactCommit: (durationMs: number, commitTimeMs: number) => void;

	world: WorldPerf;
	setWorld: (p: Partial<WorldPerf>) => void;

	counts: Counters;
	setCounts: (p: Partial<Counters>) => void;
};

export const usePerfStore = create<PerfState>((set) => {
	const reactTimes: number[] = [];
	const reactDurations: number[] = [];

	function recomputeReact(commitTimeMs: number) {
		while (reactTimes.length && commitTimeMs - reactTimes[0] > 1000) {
			reactTimes.shift();
		}
		const commitsPerSec = reactTimes.length;

		const slice = reactDurations.slice(-30);
		const avg =
			slice.length === 0 ? 0 : slice.reduce((a, b) => a + b, 0) / slice.length;

		return { commitsPerSec, avgCommitMs: avg };
	}

	return {
		enabled: true,
		toggle: () => set((s) => ({ enabled: !s.enabled })),
		setEnabled: (v) => set({ enabled: v }),

		pixi: { fps: 0, frameMs: 0, screenW: 0, screenH: 0, resolution: 1 },
		setPixi: (p) => set((s) => ({ pixi: { ...s.pixi, ...p } })),

		react: { lastCommitMs: 0, avgCommitMs: 0, commitsPerSec: 0 },
		pushReactCommit: (durationMs, commitTimeMs) => {
			reactTimes.push(commitTimeMs);
			reactDurations.push(durationMs);
			const next = recomputeReact(commitTimeMs);

			set((s) => ({
				react: {
					...s.react,
					lastCommitMs: durationMs,
					avgCommitMs: next.avgCommitMs,
					commitsPerSec: next.commitsPerSec,
				},
			}));
		},

		world: {
			worldAvgMs: 0,
			worldMaxMs: 0,
			groundAvgMs: 0,
			groundMaxMs: 0,
			creaturesAvgMs: 0,
			creaturesMaxMs: 0,
			overlayAvgMs: 0,
			overlayMaxMs: 0,
			debugAvgMs: 0,
			debugMaxMs: 0,
		},
		setWorld: (p) => set((s) => ({ world: { ...s.world, ...p } })),

		counts: {
			groundSprites: 0,
			creaturesTotal: 0,
			creaturesVisible: 0,
			tilesInCache: 0,
			viewDirty: false,
			tilesDirty: false,
			creaturesDirty: false,
		},
		setCounts: (p) => set((s) => ({ counts: { ...s.counts, ...p } })),
	};
});
