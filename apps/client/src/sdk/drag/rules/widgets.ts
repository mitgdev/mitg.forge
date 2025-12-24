import { registerRule } from "@/sdk/drag/rules";
import { Kinds, Zones } from "@/sdk/drag/types";
import { type PanelId, useLayoutStore } from "@/sdk/store/layout";

registerRule({
	kind: Kinds.WIDGET,
	zone: Zones.PANEL,
	canDrop: (payload, target) => {
		return payload.kind === Kinds.WIDGET && target.zone === Zones.PANEL;
	},
	onDrop: (payload, target) => {
		if (payload.kind !== Kinds.WIDGET) return;
		if (target.zone !== Zones.PANEL) return;

		useLayoutStore.getState().moveWidget({
			widgetId: payload.widgetId,
			fromPanelId: payload.fromPanelId as PanelId,
			fromIndex: payload.fromIndex,
			toPanelId: target.panelId as PanelId,
			toIndex: target.index,
		});
	},
	getPreview: (payload) => {
		if (payload.kind !== Kinds.WIDGET) return { label: "Widget" };
		const widget = useLayoutStore.getState().widgets[payload.widgetId];
		return { label: widget.title ?? "Widget" };
	},
});
