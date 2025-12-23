import { create } from "zustand";

export type GameConfigPanels = {
	left1: boolean;
	left2: boolean;
	right1: boolean;
	right2: boolean;
	right3: boolean;
	health: boolean;
	chat: boolean;
};

export type PanelSlot = keyof GameConfigPanels;

type GameConfigState = {
	panels: GameConfigPanels;
	setPanelVisibility: (
		panel: keyof GameConfigState["panels"],
		visible: boolean,
	) => void;
};

export const useConfigStore = create<GameConfigState>((set, get) => ({
	panels: {
		left1: false,
		left2: false,
		right1: true,
		right2: false,
		right3: false,
		health: false,
		chat: true,
	},
	setPanelVisibility: (panel, visible) => {
		const panels = { ...get().panels, [panel]: visible };
		set({ panels });
	},
}));
