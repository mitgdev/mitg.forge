import { Fragment } from "react";
import { Widget } from "@/components/Widget";
import { useDragStore } from "@/sdk/store/drag";
import type { PanelId } from "@/sdk/store/layout";
import { useLayoutStore } from "@/sdk/store/layout";
import { cn } from "@/sdk/utils/cn";

function InsertIndicator({ ok }: { ok: boolean }) {
	return (
		<div
			className={cn("my-1 h-0.5 rounded", {
				"bg-emerald-400/60": ok,
				"bg-red-500/60": !ok,
			})}
		/>
	);
}

export function Panel({ panelId, title }: { panelId: PanelId; title: string }) {
	const ids = useLayoutStore((s) => s.panels[panelId]);

	const dragging = useDragStore((s) => s.dragging);
	const target = useDragStore((s) => s.target);
	const canDrop = useDragStore((s) => s.canDrop);

	const active =
		dragging && target?.zone === "PANEL" && target.panelId === panelId;

	const insertIndex = active && target?.zone === "PANEL" ? target.index : -1;

	return (
		<div className="h-full min-h-0 p-2">
			<div className="mb-2 text-neutral-300 text-xs">{title}</div>

			<div
				data-dropzone="PANEL"
				data-panel-id={panelId}
				className={cn(
					"min-h-0 rounded border border-neutral-800 bg-neutral-900/40 p-2",
					active && canDrop && "outline-1 outline-emerald-400/30",
					active && !canDrop && "outline-1 outline-red-500/30",
				)}
			>
				{ids.map((id, i) => (
					<Fragment key={id}>
						{active && insertIndex === i && <InsertIndicator ok={canDrop} />}
						<Widget panelId={panelId} index={i} widgetId={id} />
					</Fragment>
				))}

				{active && insertIndex === ids.length && (
					<InsertIndicator ok={canDrop} />
				)}
			</div>
		</div>
	);
}
