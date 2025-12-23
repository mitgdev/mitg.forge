import { useEffect } from "react";
import { createPortal } from "react-dom";
import { resolveDomTarget } from "@/sdk/drag/resolveDomTarget";
import { resolveRule } from "@/sdk/drag/rules";
import { AvailableZones, type WorldDropTarget } from "@/sdk/drag/types";
import { screenToTile } from "@/sdk/game/screenToTile";
import { useDragStore } from "@/sdk/store/drag";
import { useGameStore } from "@/sdk/store/game";

export function DragControllerLayer() {
	const dragging = useDragStore((s) => s.dragging);
	const pointer = useDragStore((s) => s.pointer);
	const preview = useDragStore((s) => s.preview);

	const worldEl = useDragStore((s) => s.worldEl);
	const viewport = useDragStore((s) => s.viewport);

	const setPointer = useDragStore((s) => s.setPointer);
	const setTarget = useDragStore((s) => s.setTarget);
	const endDrag = useDragStore((s) => s.endDrag);

	const playerPosition = useGameStore((s) => s.playerPosition);

	useEffect(() => {
		if (!dragging) return;

		const onMove = (event: PointerEvent) => {
			const x = event.clientX;
			const y = event.clientY;
			setPointer({ x, y });

			const domTarget = resolveDomTarget(x, y);
			if (domTarget) {
				const { canDrop } = domTarget
					? resolveRule(dragging, domTarget)
					: { canDrop: false };
				setTarget(domTarget, canDrop);
				return;
			}

			if (!worldEl || !viewport) {
				setTarget(null, false);
				return;
			}

			const rect = worldEl.getBoundingClientRect();
			const localX = x - rect.left;
			const localY = y - rect.top;

			const tile = screenToTile({
				localX,
				localY,
				viewport,
				player: playerPosition,
			});

			if (!tile) {
				setTarget(null, false);
				return;
			}

			const worldTarget = {
				zone: AvailableZones.WORLD,
				tile,
			} satisfies WorldDropTarget;
			const { canDrop } = resolveRule(dragging, worldTarget);
			setTarget(worldTarget, canDrop);
		};

		const onUp = () => {
			const state = useDragStore.getState();
			const payload = state.dragging;
			const target = state.target;

			if (payload && target) {
				const response = resolveRule(payload, target);

				if (response.rule) {
					response.rule.onDrop(payload, target);
				}
			}

			endDrag();
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
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
	}, [
		dragging,
		worldEl,
		viewport,
		playerPosition,
		setPointer,
		setTarget,
		endDrag,
	]);

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
			{preview?.label ?? `${dragging.kind}`}
		</div>
	);

	return createPortal(ghost, document.body);
}
