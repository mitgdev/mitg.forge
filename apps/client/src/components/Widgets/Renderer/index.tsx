import { useLayoutStore } from "@/sdk/store/layout";

export function WidgetRenderer({ widgetId }: { widgetId: string }) {
	const widget = useLayoutStore((s) => s.widgets[widgetId]);
	if (!widget) return null;

	if (widget.type === "skills")
		return <div className="p-2 text-white text-xs">Skills content…</div>;
	if (widget.type === "battleList")
		return <div className="p-2 text-white text-xs">Battle list…</div>;
	if (widget.type === "backpack")
		return (
			<div className="p-2 text-white text-xs">
				Backpack: {widget.containerId}
			</div>
		);

	return null;
}
