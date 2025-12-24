import { useEffect } from "react";
import { createPortal } from "react-dom";
import { resolveDomTarget } from "@/sdk/drag/resolveDomTarget";
import { resolveRule } from "@/sdk/drag/rules";
import { useDragStore } from "@/sdk/store/drag";

export function DragControllerLayer() {
	const dragging = useDragStore((s) => s.dragging);
	const pointer = useDragStore((s) => s.pointer);
	const preview = useDragStore((s) => s.preview);

	const setPointer = useDragStore((s) => s.setPointer);
	const setTarget = useDragStore((s) => s.setTarget);
	const endDrag = useDragStore((s) => s.endDrag);

	useEffect(() => {
		const onMove = (event: PointerEvent) => {
			const x = event.clientX;
			const y = event.clientY;
			setPointer({ x, y });

			const domTarget = resolveDomTarget(x, y);
			if (!domTarget) {
				setTarget(null, false);
				return;
			}

			if (!dragging) {
				setTarget(null, false);
				return;
			}

			const { canDrop } = resolveRule(dragging, domTarget);
			setTarget(domTarget, canDrop);
		};

		const onUp = (_event: PointerEvent) => {
			const state = useDragStore.getState();
			const payload = state.dragging;
			const target = state.target;
			const canDrop = state.canDrop;

			if (payload && target && canDrop) {
				const { rule } = resolveRule(payload, target);
				rule?.onDrop(payload, target);
			}

			endDrag();
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && dragging) {
				endDrag();
			}
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

	if (!dragging || !pointer) return null;

	const ghost = (
		<div
			style={{
				position: "fixed",
				left: pointer.x + 12,
				top: pointer.y + 12,
				zIndex: 100000,
				pointerEvents: "none",
			}}
			className="rounded border border-neutral-700 bg-neutral-900/90 px-2 py-1 text-neutral-200 text-xs"
		>
			{preview?.label ?? dragging.kind}
		</div>
	);

	return createPortal(ghost, document.body);
}
