import { Kinds, Zones } from "@/sdk/drag/types";
import { useDragStore } from "@/sdk/store/drag";
import type { PanelId } from "@/sdk/store/layout";
import { useLayoutStore } from "@/sdk/store/layout";

export function Widget({
	panelId,
	index,
	widgetId,
}: {
	panelId: PanelId;
	index: number;
	widgetId: string;
}) {
	const def = useLayoutStore((s) => s.widgets[widgetId]);
	const startDrag = useDragStore((s) => s.startDrag);

	return (
		<div
			data-widget-root="true"
			className="rounded border border-neutral-700 bg-neutral-950 text-neutral-200"
		>
			<div
				className="cursor-move select-none border-neutral-800 border-b px-2 py-1 text-xs"
				style={{ touchAction: "none" }}
				onPointerDown={(e) => {
					e.preventDefault();

					// opcional: captura o pointer (bom pra não “perder” o drag)
					(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);

					startDrag(
						{
							kind: Kinds.WIDGET,
							widgetId,
							from: Zones.PANEL,
							fromPanelId: panelId,
							fromIndex: index,
						},
						{ x: e.clientX, y: e.clientY },
						{ label: def?.title ?? "Widget" },
					);
				}}
			>
				{def?.title ?? widgetId}
			</div>

			{/* body do widget */}
			<div className="p-2 text-neutral-300 text-xs">conteúdo...</div>
		</div>
	);
}
