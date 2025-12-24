import { create } from "zustand";

export type PanelId = "left1" | "left2" | "right1" | "right2" | "right3";
export type WidgetId = string;

export type WidgetDef = {
	id: WidgetId;
	title: string;
};

type LayoutState = {
	widgets: Record<WidgetId, WidgetDef>;
	panels: Record<PanelId, WidgetId[]>;

	moveWidget: (args: {
		widgetId: WidgetId;
		fromPanelId: PanelId;
		fromIndex: number;
		toPanelId: PanelId;
		toIndex: number;
	}) => void;
};

export const useLayoutStore = create<LayoutState>((set) => ({
	widgets: {
		"widget-1": { id: "widget-1", title: "Widget 1" },
		"widget-2": { id: "widget-2", title: "Widget 2" },
		"widget-3": { id: "widget-3", title: "Widget 3" },
	},

	panels: {
		left1: ["widget-1", "widget-2"],
		left2: ["widget-3"],
		right1: [],
		right2: [],
		right3: [],
	},

	moveWidget: ({ fromIndex, fromPanelId, toIndex, toPanelId, widgetId }) =>
		set((state) => {
			const fromArray = [...state.panels[fromPanelId]];
			const toArray =
				fromPanelId === toPanelId ? fromArray : [...state.panels[toPanelId]];

			const at = fromArray.indexOf(widgetId);
			const removeIndex = at >= 0 ? at : fromIndex;
			if (removeIndex >= 0) {
				fromArray.splice(removeIndex, 1);
			}

			let insertIndex = toIndex;
			if (fromPanelId === toPanelId) {
				if (removeIndex < insertIndex) insertIndex -= 1;

				insertIndex = Math.max(0, Math.min(insertIndex, fromArray.length));
				fromArray.splice(insertIndex, 0, widgetId);

				return {
					...state,
					panels: {
						...state.panels,
						[fromPanelId]: fromArray,
					},
				};
			}

			insertIndex = Math.max(0, Math.min(insertIndex, toArray.length));
			toArray.splice(insertIndex, 0, widgetId);

			return {
				...state,
				panels: {
					...state.panels,
					[fromPanelId]: fromArray,
					[toPanelId]: toArray,
				},
			};
		}),
}));
