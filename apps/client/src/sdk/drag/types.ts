export const AvailableZones = {
	WORLD: "WORLD",
	PANEL: "PANEL",
	INVENTORY: "INVENTORY",
} as const;

export const AvailableKinds = {
	ITEM: "ITEM",
	WIDGET: "WIDGET",
} as const;

export type WorldTile = {
	vx: number;
	vy: number;
	x: number;
	y: number;
	z: number;
};

export type DragPayload =
	| {
			kind: typeof AvailableKinds.ITEM;
			itemId: string;
			from:
				| typeof AvailableZones.PANEL
				| typeof AvailableZones.WORLD
				| typeof AvailableZones.INVENTORY;
	  }
	| {
			kind: typeof AvailableKinds.WIDGET;
			widgetId: string;
			fromPanelId: string;
	  };

export type WorldDropTarget = {
	zone: typeof AvailableZones.WORLD;
	tile: WorldTile;
};

export type PanelDropTarget = {
	zone: typeof AvailableZones.PANEL;
	panelId: string;
};

export type InventoryDropTarget = {
	zone: typeof AvailableZones.INVENTORY;
	panelId: string;
};

export type DropTarget =
	| WorldDropTarget
	| PanelDropTarget
	| InventoryDropTarget
	| null;

export type DragPayloadKind = keyof typeof AvailableKinds;
export type DropTargetZone = keyof typeof AvailableZones;

export type DragViewportTransform = {
	stageW: number;
	stageH: number;
	scale: number;
	offsetX: number;
	offsetY: number;
};

export type DragPreview = {
	label?: string;
	iconUrl?: string;
};
