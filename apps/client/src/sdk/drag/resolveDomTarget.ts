import type { PanelId } from "@/sdk/store/layout";
import { AvailableZones, type DropTarget, type PanelDropTarget } from "./types";

function getInsertIndex(panelEl: HTMLElement, clientY: number) {
	const items = Array.from(
		panelEl.querySelectorAll<HTMLElement>("[data-widget-id]"),
	);

	// se painel vazio -> 0
	if (items.length === 0) return 0;

	// encontra o primeiro item cujo midpoint é > mouseY
	for (let i = 0; i < items.length; i++) {
		const r = items[i].getBoundingClientRect();
		const mid = r.top + r.height / 2;
		if (clientY < mid) return i;
	}

	// senão entra no final
	return items.length;
}

export function resolveDomTarget(clientX: number, clientY: number): DropTarget {
	const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
	if (!el) return null;

	const zoneEl = el.closest("[data-dropzone]") as HTMLElement | null;
	if (!zoneEl) return null;

	const zone = zoneEl.dataset.dropzone;

	if (zone === AvailableZones.PANEL) {
		const panelId = (zoneEl.dataset.panelId ?? "right3") as PanelId;
		const insertIndex = getInsertIndex(zoneEl, clientY);

		const target: PanelDropTarget = {
			zone: AvailableZones.PANEL,
			panelId,
			insertIndex,
		};
		return target;
	}

	return null;
}
