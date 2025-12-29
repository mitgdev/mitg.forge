import { useEffect } from "react";
import { resolveDomTarget } from "@/sdk/drag/resolveDomTarget";
import { resolveRule } from "@/sdk/drag/rules";
import { useDragStore } from "@/sdk/store/drag";

export function useDragControllerLayer() {
	const dragging = useDragStore((s) => s.dragging);
	const setPointer = useDragStore((s) => s.setPointer);
	const setTarget = useDragStore((s) => s.setTarget);
	const endDrag = useDragStore((s) => s.endDrag);

	useEffect(() => {
		if (!dragging) return;

		const onMove = (e: PointerEvent) => {
			const x = e.clientX;
			const y = e.clientY;

			setPointer({ x, y });

			const domTarget = resolveDomTarget(x, y);
			if (!domTarget) {
				setTarget(null, false);
				return;
			}

			const { canDrop } = resolveRule(dragging, domTarget);
			setTarget(domTarget, canDrop);
		};

		const onUp = () => {
			const state = useDragStore.getState();
			const payload = state.dragging;
			const target = state.target;

			if (payload && target) {
				const res = resolveRule(payload, target);
				if (res.rule) res.rule.onDrop(payload, target);
			}
			endDrag();
		};

		const onKeyDown = (ev: KeyboardEvent) => {
			if (ev.key === "Escape") endDrag();
		};

		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [dragging, setPointer, setTarget, endDrag]);
}
