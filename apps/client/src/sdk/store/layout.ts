import { create } from "zustand";

export type PanelId = "left1" | "left2" | "right1" | "right2" | "right3";

export type WidgetType = "skills" | "battleList" | "backpack";

export type WidgetModel = {
	id: string;
	type: WidgetType;
	title: string;
	// pra backpack, exemplo:
	containerId?: string;
};

type LayoutState = {
	widgets: Record<string, WidgetModel>;
	panels: Record<PanelId, string[]>; // lista de widgetIds por painel

	findWidget: (widgetId: string) => { panelId: PanelId; index: number } | null;

	moveWidget: (args: {
		widgetId: string;
		toPanelId: PanelId;
		toIndex: number;
	}) => void;
};

export const useLayoutStore = create<LayoutState>((set, get) => ({
	widgets: {
		skills: { id: "skills", type: "skills", title: "Skills" },
		battle: { id: "battle", type: "battleList", title: "Battle" },
		bp1: {
			id: "bp1",
			type: "backpack",
			title: "Backpack",
			containerId: "bp:1",
		},
	},

	panels: {
		left1: ["skills", "battle"],
		left2: ["bp1"],
		right1: [],
		right2: [],
		right3: [],
	},

	findWidget: (widgetId) => {
		const panels = get().panels;
		for (const panelId of Object.keys(panels) as PanelId[]) {
			const idx = panels[panelId].indexOf(widgetId);
			if (idx !== -1) return { panelId, index: idx };
		}
		return null;
	},

	moveWidget: ({ widgetId, toPanelId, toIndex }) => {
		set((s) => {
			const from = get().findWidget(widgetId);
			if (!from) return s;

			const nextPanels: LayoutState["panels"] = structuredClone(s.panels);

			// remove do painel origem
			nextPanels[from.panelId].splice(from.index, 1);

			// ajusta índice se for o mesmo painel e a remoção foi antes do destino
			let insertIndex = toIndex;
			if (from.panelId === toPanelId && from.index < toIndex) {
				insertIndex = Math.max(0, toIndex - 1);
			}

			// clamp
			insertIndex = Math.max(
				0,
				Math.min(insertIndex, nextPanels[toPanelId].length),
			);

			// insere no destino
			nextPanels[toPanelId].splice(insertIndex, 0, widgetId);

			return { ...s, panels: nextPanels };
		});
	},
}));
