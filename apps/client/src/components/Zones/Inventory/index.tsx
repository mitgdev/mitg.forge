import { AvailableZones } from "@/sdk/drag/types";
import { useDragStore } from "@/sdk/store/drag";

export function InventoryPanel() {
	return (
		<div
			data-dropzone={AvailableZones.INVENTORY}
			data-panel-id={AvailableZones.INVENTORY}
			className="min-h-9 bg-white/20"
		>
			Drop items here
		</div>
	);
}

export function InventoryItem({ itemId }: { itemId: string }) {
	const startDrag = useDragStore((s) => s.startDrag);

	return (
		<div
			className="flex h-10 w-10 cursor-grab select-none items-center justify-center rounded border border-neutral-700 bg-neutral-900 text-neutral-200 text-xs"
			onPointerDown={(e) => {
				e.preventDefault();
				startDrag(
					{ kind: "ITEM", itemId, from: AvailableZones.INVENTORY },
					{ x: e.clientX, y: e.clientY },
					{ label: `Item ${itemId}` },
				);
			}}
		>
			{itemId}
		</div>
	);
}
