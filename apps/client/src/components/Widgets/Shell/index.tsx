import { AvailableKinds } from "@/sdk/drag/types";
import { useDragStore } from "@/sdk/store/drag";
import { type PanelId, useLayoutStore } from "@/sdk/store/layout";
import { cn } from "@/sdk/utils/cn";
import { WidgetRenderer } from "../Renderer";

export function WidgetShell({
	widgetId,
	panelId,
	index,
}: {
	widgetId: string;
	panelId: string;
	index: number;
}) {
	const widget = useLayoutStore((s) => s.widgets[widgetId]);

	const startDrag = useDragStore((s) => s.startDrag);
	const dragging = useDragStore((s) => s.dragging);

	const isDraggingThis =
		dragging?.kind === AvailableKinds.WIDGET && dragging.widgetId === widgetId;

	const onHeaderPointerDown = (e: React.PointerEvent) => {
		e.preventDefault();

		const widgetElement = (e.currentTarget as HTMLElement).closest(
			"[data-widget-id]",
		) as HTMLElement | null;

		const rect = widgetElement?.getBoundingClientRect();

		startDrag(
			{
				kind: AvailableKinds.WIDGET,
				widgetId,
				from: "PANEL",
				fromPanelId: panelId as PanelId,
				fromIndex: index,
			},
			{ x: e.clientX, y: e.clientY },
			{
				type: "WIDGET",
				widgetId,
				height: rect?.height || 120,
				width: rect?.width || 175,
			},
		);
	};

	return (
		<div
			data-widget-id={widgetId}
			className="w-full max-w-43.75 overflow-hidden bg-neutral-950 outline-1 outline-neutral-800"
		>
			{/* drag handle */}
			<div
				onPointerDown={onHeaderPointerDown}
				className={cn(
					"cursor-grab select-none border-neutral-800 border-b px-2 py-1 text-white text-xs",
					isDraggingThis && "cursor-grabbing",
				)}
			>
				{widget?.title ?? widgetId}
			</div>

			<div className={cn(isDraggingThis && "bg-neutral-900/60")}>
				<div className={cn(isDraggingThis && "pointer-events-none opacity-0")}>
					<WidgetRenderer widgetId={widgetId} />
				</div>
			</div>
		</div>
	);
}
