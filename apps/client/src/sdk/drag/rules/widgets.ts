import { registerRule } from "@/sdk/drag/rules";
import { AvailableKinds, AvailableZones } from "@/sdk/drag/types";
import { type PanelId, useLayoutStore } from "@/sdk/store/layout";

registerRule({
	kind: AvailableKinds.WIDGET,
	zone: AvailableZones.PANEL,
	canDrop: (payload) => payload.kind === AvailableKinds.WIDGET,
	onDrop: (payload, target) => {
		if (payload.kind !== AvailableKinds.WIDGET) return;
		if (target.zone !== AvailableZones.PANEL) return;

		useLayoutStore.getState().moveWidget({
			widgetId: payload.widgetId,
			toPanelId: target.panelId,
			toIndex: target.insertIndex,
		});
	},
});
