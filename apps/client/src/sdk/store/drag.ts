import { create } from "zustand";
import type {
	DragPayload,
	DragPreview,
	DragViewportTransform,
	DropTarget,
} from "../drag/types";

type DragState = {
	worldEl: HTMLDivElement | null;
	setWorldEl: (el: HTMLDivElement | null) => void;

	viewport: DragViewportTransform | null;
	setViewport: (v: DragViewportTransform) => void;

	dragging: DragPayload | null;
	pointer: { x: number; y: number } | null;
	target: DropTarget;
	canDrop: boolean;
	preview: DragPreview | null;

	startDrag: (
		payload: DragPayload,
		startPointer: { x: number; y: number },
		preview?: DragPreview,
	) => void;
	setPointer: (p: { x: number; y: number } | null) => void;
	setTarget: (t: DropTarget, canDrop: boolean) => void;
	endDrag: () => void;
};

export const useDragStore = create<DragState>((set) => ({
	worldEl: null,
	setWorldEl: (el) => set({ worldEl: el }),

	viewport: null,
	setViewport: (v) => set({ viewport: v }),

	dragging: null,
	pointer: null,
	target: null,
	canDrop: false,
	preview: null,

	startDrag: (payload, startPointer, preview) =>
		set({
			dragging: payload,
			pointer: startPointer,
			target: null,
			canDrop: false,
			preview: preview ?? { label: payload.kind },
		}),

	setPointer: (p) => set({ pointer: p }),

	setTarget: (t, canDrop) =>
		set((s) => {
			// evita re-render spam quando nada muda
			const sameTarget =
				JSON.stringify(s.target) === JSON.stringify(t) && s.canDrop === canDrop;
			return sameTarget ? s : { ...s, target: t, canDrop };
		}),

	endDrag: () =>
		set({
			dragging: null,
			pointer: null,
			target: null,
			canDrop: false,
			preview: null,
		}),
}));
