import { create } from "zustand";

type PixiPerf = {
	fps: number;
	frameMs: number;
	width: number;
	height: number;
	dpr: number;
};

type ReactPerf = {
	commitsPerSec: number;
	avgCommitMs: number;
	lastCommitMs: number;
};

type DevtoolsState = {
	enabled: boolean;
	toggle: () => void;

	pixi: PixiPerf | null;
	react: ReactPerf | null;

	// internos (contadores)
	_reactCommits: number;
	_reactDurSum: number;
	_reactLastMs: number;

	setPixi: (p: PixiPerf) => void;
	noteReactCommit: (ms: number) => void;
	tickReactWindow: () => void;
};

export const useDevtoolsStore = create<DevtoolsState>((set, get) => ({
	enabled: true,
	toggle: () => set((s) => ({ enabled: !s.enabled })),

	pixi: null,
	react: { commitsPerSec: 0, avgCommitMs: 0, lastCommitMs: 0 },

	_reactCommits: 0,
	_reactDurSum: 0,
	_reactLastMs: 0,

	setPixi: (p) => set({ pixi: p }),

	noteReactCommit: (ms) =>
		set((s) => ({
			_reactCommits: s._reactCommits + 1,
			_reactDurSum: s._reactDurSum + ms,
			_reactLastMs: ms,
		})),

	tickReactWindow: () => {
		const s = get();
		const commits = s._reactCommits;
		const avg = commits > 0 ? s._reactDurSum / commits : 0;

		// janela de 1s (a gente vai chamar 1x por segundo)
		set({
			react: {
				commitsPerSec: commits,
				avgCommitMs: avg,
				lastCommitMs: s._reactLastMs,
			},
			_reactCommits: 0,
			_reactDurSum: 0,
		});
	},
}));
