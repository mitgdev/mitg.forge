import type { PanelId } from "@/sdk/store/layout";

export const AvailableZones = {
	PANEL: "PANEL",
} as const;

export const AvailableKinds = {
	WIDGET: "WIDGET",
} as const;

export type DragPayload = {
	kind: typeof AvailableKinds.WIDGET;
	widgetId: string;
	from: typeof AvailableZones.PANEL;
	fromPanelId: PanelId;
	fromIndex: number;
};

export type PanelDropTarget = {
	zone: typeof AvailableZones.PANEL;
	panelId: PanelId;
	insertIndex: number; // <- onde vai entrar
};

export type DropTarget = PanelDropTarget | null;

export type DragPreview =
	| { type: "LABEL"; label: string }
	| { type: "WIDGET"; widgetId: string; width: number; height: number };
