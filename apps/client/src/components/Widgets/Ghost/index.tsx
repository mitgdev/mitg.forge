import { createPortal } from "react-dom";
import { useDragStore } from "@/sdk/store/drag";
import { WidgetRenderer } from "../Renderer";

export function WidgetDragGhost() {
	const dragging = useDragStore((s) => s.dragging);
	const pointer = useDragStore((s) => s.pointer);
	const preview = useDragStore((s) => s.preview);
	const canDrop = useDragStore((s) => s.canDrop);

	if (!dragging || !pointer || !preview) return null;
	if (preview.type !== "WIDGET") return null;

	const ghost = (
		<div
			style={{
				position: "fixed",
				left: pointer.x + 12,
				top: pointer.y + 12,
				zIndex: 100000,
				pointerEvents: "none",
				width: preview.width,
				height: preview.height,
				boxSizing: "border-box",
			}}
		>
			<div
				className="rounded border border-neutral-700 bg-neutral-950/95"
				style={{
					width: "100%",
					height: "100%",
					opacity: canDrop ? 1 : 0.65,
					transform: "translateZ(0)",
				}}
			>
				<div className="select-none border-neutral-800 border-b px-2 py-1 text-white text-xs">
					{/* pode mostrar title real se quiser */}
					Widget
				</div>

				{/* ✅ aparece, mas não interage */}
				<div inert>
					<WidgetRenderer widgetId={preview.widgetId} />
				</div>
			</div>
		</div>
	);

	return createPortal(ghost, document.body);
}
