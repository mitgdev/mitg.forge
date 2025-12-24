export const Zones = {
	PANEL: "PANEL",
} as const;

export const Kinds = {
	WIDGET: "WIDGET",
} as const;

export type KeyedZone = (typeof Zones)[keyof typeof Zones];
export type KeyedKind = (typeof Kinds)[keyof typeof Kinds];

export type DropTarget = {
	zone: typeof Zones.PANEL;
	panelId: string;
	index: number;
} | null;

export type DragPayload = {
	kind: typeof Kinds.WIDGET;
	widgetId: string;
	from: typeof Zones.PANEL;
	fromPanelId: string;
	fromIndex: number;
};

export type DragPreview = { label?: string };
