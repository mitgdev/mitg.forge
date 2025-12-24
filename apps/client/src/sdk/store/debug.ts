import { create } from "zustand";

type State = {
	showGrid: boolean;
	toggleGrid: () => void;
	setShowGrid: (v: boolean) => void;
};

export const useDebugStore = create<State>((set) => ({
	showGrid: true,
	toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
	setShowGrid: (v) => set({ showGrid: v }),
}));
