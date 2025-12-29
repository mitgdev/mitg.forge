import { AvailableZones } from "@/sdk/drag/types";
import { useDragStore } from "@/sdk/store/drag";
import { type PanelId, useLayoutStore } from "@/sdk/store/layout";
import { cn } from "@/sdk/utils/cn";
import { WidgetShell } from "../Widgets/Shell";

export function PanelTargetOutline({ panelId }: { panelId: string }) {
	const dragging = useDragStore((s) => s.dragging);
	const target = useDragStore((s) => s.target);
	const canDrop = useDragStore((s) => s.canDrop);

	const isTarget =
		!!dragging &&
		!!target &&
		target.zone === AvailableZones.PANEL &&
		target.panelId === panelId;

	const isStartingPanel =
		dragging?.from === AvailableZones.PANEL &&
		dragging?.fromPanelId === panelId;

	if (isStartingPanel) return null;

	if (!isTarget) return null;

	return (
		<div
			className={cn(
				"pointer-events-none absolute inset-0 z-50",
				// ✅ tibia-like: contorno dentro do painel (não “empurra” layout)
				canDrop
					? "-outline-offset-1 outline-1 outline-white"
					: "-outline-offset-1 outline-1 outline-red-500",
			)}
		/>
	);
}

export function Panel({ panelId }: { panelId: PanelId }) {
	const widgetIds = useLayoutStore((s) => s.panels[panelId]);

	return (
		<div
			data-dropzone="PANEL"
			data-panel-id={panelId}
			className="relative h-full min-h-0 w-full min-w-0"
		>
			<PanelTargetOutline panelId={panelId} />
			{widgetIds.map((id, idx) => (
				<WidgetShell key={id} widgetId={id} panelId={panelId} index={idx} />
			))}
		</div>
	);
}
