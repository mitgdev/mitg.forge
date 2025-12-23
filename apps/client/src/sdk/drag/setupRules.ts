import { registerRule } from "./rules";
import { AvailableKinds, AvailableZones } from "./types";

// Inventory to World
registerRule({
	kind: AvailableKinds.ITEM,
	zone: AvailableZones.WORLD,
	canDrop: (payload) => {
		return (
			payload.kind === AvailableKinds.ITEM &&
			payload.from === AvailableZones.INVENTORY
		);
	},
	onDrop: (payload, target) => {
		if (
			payload.kind === AvailableKinds.ITEM &&
			target.zone === AvailableZones.WORLD
		) {
			console.log(
				`Dropped item ${payload.itemId} onto world tile at (${target.tile.x}, ${target.tile.y}, ${target.tile.z})`,
			);
		}
	},
});

// World to Inventory
registerRule({
	kind: AvailableKinds.ITEM,
	zone: AvailableZones.INVENTORY,
	canDrop: (payload) => {
		return (
			payload.kind === AvailableKinds.ITEM &&
			payload.from === AvailableZones.WORLD
		);
	},
	onDrop: (payload, target) => {
		if (
			payload.kind === AvailableKinds.ITEM &&
			target.zone === AvailableZones.INVENTORY
		) {
			console.log(
				`Moved item ${payload.itemId} from world to inventory panel ${target.panelId}`,
			);
		}
	},
});

// World to World
registerRule({
	kind: AvailableKinds.ITEM,
	zone: AvailableZones.WORLD,
	canDrop: (payload) => {
		return (
			payload.kind === AvailableKinds.ITEM &&
			payload.from === AvailableZones.WORLD
		);
	},
	onDrop: (payload, target) => {
		if (
			payload.kind === AvailableKinds.ITEM &&
			target.zone === AvailableZones.WORLD
		) {
			console.log(
				`Moved item ${payload.itemId} within world to tile at (${target.tile.x}, ${target.tile.y}, ${target.tile.z})`,
			);
		}
	},
});

// World to Panel
registerRule({
	kind: AvailableKinds.ITEM,
	zone: AvailableZones.PANEL,
	canDrop: (payload) => {
		return (
			payload.kind === AvailableKinds.ITEM &&
			payload.from === AvailableZones.WORLD
		);
	},
	onDrop: (payload, target) => {
		if (
			payload.kind === AvailableKinds.ITEM &&
			target.zone === AvailableZones.PANEL
		) {
			console.log(
				`Dropped item ${payload.itemId} onto panel ${target.panelId}`,
			);
		}
	},
});
