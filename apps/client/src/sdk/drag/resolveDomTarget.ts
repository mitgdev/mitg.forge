import { AvailableZones, type DropTarget, type DropTargetZone } from "./types";

export function resolveDomTarget(clientX: number, clientY: number): DropTarget {
	const element = document.elementFromPoint(
		clientX,
		clientY,
	) as HTMLElement | null;

	if (!element) return null;

	const zoneElement = element.closest("[data-dropzone]") as HTMLElement | null;
	if (!zoneElement) return null;

	const zone = zoneElement.dataset.dropzone as DropTargetZone;

	if (zone === AvailableZones.INVENTORY) {
		return {
			zone: AvailableZones.INVENTORY,
			panelId: zoneElement.dataset.panelId ?? "inventory",
		};
	}

	if (zone === AvailableZones.PANEL) {
		return {
			zone: AvailableZones.PANEL,
			panelId: zoneElement.dataset.panelId ?? "panel",
		};
	}

	return null;
}
