import { create } from "zustand";
import type { DragPayload, DragPreview, DropTarget } from "@/sdk/drag/types";

function targetKey(t: DropTarget) {
	if (!t) return "";
	return `P:${t.panelId}:${t.insertIndex}`;
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

export const useDragStore = create<DragState>((set, get) => ({
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
			preview: preview ?? { type: "LABEL", label: payload.kind },
		}),

	setPointer: (p) => set({ pointer: p }),

	setTarget: (t, canDrop) => {
		const s = get();
		const same = targetKey(s.target) === targetKey(t) && s.canDrop === canDrop;
		if (same) return;
		set({ target: t, canDrop });
	},

	endDrag: () =>
		set({
			dragging: null,
			pointer: null,
			target: null,
			canDrop: false,
			preview: null,
		}),
}));
