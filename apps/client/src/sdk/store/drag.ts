import { create } from "zustand";
import type { DragPayload, DragPreview, DropTarget } from "../drag/types";

function targetKey(t: DropTarget) {
	if (!t) return "";
	return `P:${t.panelId}:${t.index}`;
}

type DragState = {
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
	dragging: null,
	pointer: null,

	target: null,
	canDrop: false,
	preview: null,

	startDrag: (payload, startPointer, preview) =>
		set(() => {
			return {
				dragging: payload,
				pointer: startPointer,
				target: null,
				canDrop: false,
				preview: preview ?? { label: payload.kind },
			};
		}),

	setPointer: (p) =>
		set(() => ({
			pointer: p,
		})),

	setTarget: (t, canDrop) =>
		set((state) => {
			const same =
				targetKey(state.target) === targetKey(t) && state.canDrop === canDrop;

			if (same) return {};

			return {
				target: t,
				canDrop,
			};
		}),

	endDrag: () =>
		set(() => ({
			dragging: null,
			pointer: null,
			target: null,
			canDrop: false,
			preview: null,
		})),
}));
