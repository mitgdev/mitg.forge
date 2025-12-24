import type { DropTarget } from "@/sdk/drag/types";
import { Zones } from "@/sdk/drag/types";
import { computePanelInsertIndex } from "./computePanelInsertIndex";

export function resolveDomTarget(clientX: number, clientY: number): DropTarget {
	const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
	if (!el) return null;

	// agora o dropzone é o painel inteiro
	const panel = el.closest("[data-dropzone='PANEL']") as HTMLElement | null;
	if (!panel) return null;

	const panelId = panel.dataset.panelId;
	if (!panelId) return null;

	const index = computePanelInsertIndex(panel, clientY);

	return { zone: Zones.PANEL, panelId, index };
}
