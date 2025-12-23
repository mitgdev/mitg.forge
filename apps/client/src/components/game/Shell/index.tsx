import { useMemo } from "react";
import { InventoryItem, InventoryPanel } from "@/components/Zones/Inventory";
import { useContainerSize } from "@/sdk/hooks/useContainerSize";
import {
	type GameConfigPanels,
	type PanelSlot,
	useConfigStore,
} from "@/sdk/store/config";

const PANEL_WIDTH = 175;
const MIN_CANVAS_WIDTH = 240;

// prioridade de exibição dos painéis (quais somem primeiro)
const COLUMN_PRIORITY: Array<PanelSlot> = [
	"left1",
	"left2",
	"right1",
	"right2",
	"right3",
];

export const GameShell = ({ children }: { children: React.ReactNode }) => {
	const panels = useConfigStore((state) => state.panels);

	const { ref, size } = useContainerSize<HTMLDivElement>();
	const containerWidth = size.width || 0;

	// quantas colunas laterais cabem mantendo center >= 240px
	const maxSideColumnsByWidth = useMemo(() => {
		if (containerWidth <= 0) return 0;

		const availableForSides = containerWidth - MIN_CANVAS_WIDTH;
		if (availableForSides <= 0) return 0;

		return Math.max(0, Math.floor(availableForSides / PANEL_WIDTH));
	}, [containerWidth]);

	// aplica o limite de largura em cima do que está habilitado
	const effectiveColumns = useMemo<GameConfigPanels>(() => {
		const enabledSlots = COLUMN_PRIORITY.filter((slot) => panels[slot]);
		const allowedCount = Math.min(maxSideColumnsByWidth, enabledSlots.length);
		const visibleSet = new Set(enabledSlots.slice(0, allowedCount));

		return {
			left1: visibleSet.has("left1"),
			left2: visibleSet.has("left2"),
			right1: visibleSet.has("right1"),
			right2: visibleSet.has("right2"),
			right3: visibleSet.has("right3"),
			health: panels.health,
			chat: panels.chat,
		};
	}, [maxSideColumnsByWidth, panels]);

	// grid EXTERNO: só colunas, uma linha única que ocupa a tela inteira
	const gridTemplateColumns = useMemo(
		() =>
			[
				effectiveColumns.left1 ? `${PANEL_WIDTH}px` : "0px",
				effectiveColumns.left2 ? `${PANEL_WIDTH}px` : "0px",
				"minmax(240px, 1fr)", // centro sempre >= 240px
				effectiveColumns.right1 ? `${PANEL_WIDTH}px` : "0px",
				effectiveColumns.right2 ? `${PANEL_WIDTH}px` : "0px",
				effectiveColumns.right3 ? `${PANEL_WIDTH}px` : "0px",
			].join(" "),
		[effectiveColumns],
	);

	return (
		<div
			ref={ref}
			className="h-screen w-screen overflow-hidden bg-neutral-900"
			style={{
				display: "grid",
				gridTemplateColumns,
				gridTemplateRows: "1fr",
				gridTemplateAreas: '"left1 left2 center right1 right2 right3"',
			}}
		>
			{/* LEFT PANELS */}
			<div
				style={{ gridArea: "left1" }}
				className="border-neutral-800 border-r"
			>
				{effectiveColumns.left1 && (
					<div className="h-full p-2 text-neutral-200 text-xs">
						Panel Left 1
					</div>
				)}
			</div>

			<div
				style={{ gridArea: "left2" }}
				className="border-neutral-800 border-r"
			>
				{effectiveColumns.left2 && (
					<div className="h-full p-2 text-neutral-200 text-xs">
						Panel Left 2
					</div>
				)}
			</div>

			{/* CENTER: grid INTERNO com health / game / bottom */}
			<div
				style={{ gridArea: "center" }}
				className="h-full min-h-0 w-full min-w-0"
			>
				<CenterColumn
					showHealth={effectiveColumns.health}
					showBottom={effectiveColumns.chat}
				>
					{children}
				</CenterColumn>
			</div>
			{/* RIGHT PANELS */}
			<div
				style={{ gridArea: "right1" }}
				className="border-neutral-800 border-l"
			>
				{effectiveColumns.right1 && (
					<div className="h-full p-2 text-neutral-200 text-xs">
						<InventoryPanel />
						<span>Right 1</span>
						<div className="flex flex-row flex-wrap gap-2">
							<InventoryItem itemId="Sword" />
							<InventoryItem itemId="Wand" />
							<InventoryItem itemId="Shield" />
						</div>
					</div>
				)}
			</div>

			<div
				style={{ gridArea: "right2" }}
				className="border-neutral-800 border-l"
			>
				{effectiveColumns.right2 && (
					<div className="h-full p-2 text-neutral-200 text-xs">Right 2</div>
				)}
			</div>

			<div
				style={{ gridArea: "right3" }}
				className="border-neutral-800 border-l"
			>
				{effectiveColumns.right3 && (
					<div className="h-full p-2 text-neutral-200 text-xs">Right 3</div>
				)}
			</div>
		</div>
	);
};

type CenterColumnProps = {
	children: React.ReactNode; // aqui entra o GameCanvas
	showHealth: boolean;
	showBottom: boolean;
};

const MIN_HEALTH = 40;
const MAX_HEALTH = 60;

const MIN_BOTTOM = 120;
const MAX_BOTTOM = 180;

export function CenterColumn({
	children,
	showHealth,
	showBottom,
}: CenterColumnProps) {
	const healthRow = showHealth
		? `minmax(${MIN_HEALTH}px, ${MAX_HEALTH}px)`
		: "0px";
	const bottomRow = showBottom
		? `minmax(${MIN_BOTTOM}px, ${MAX_BOTTOM}px)`
		: "0px";

	return (
		<div
			className="h-full min-h-0 w-full min-w-0"
			style={{
				display: "grid",
				gridTemplateRows: `${healthRow} 1fr ${bottomRow}`,
				gridTemplateAreas: '"health" "game" "bottom"',
			}}
		>
			<div
				style={{ gridArea: "health" }}
				className="flex min-w-0 items-center border-neutral-800 border-b px-2 text-neutral-300 text-xs"
			>
				{showHealth && <span>HP/MP bar aqui</span>}
			</div>

			<div
				style={{ gridArea: "game" }}
				className="relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden bg-black"
			>
				{children}
			</div>

			<div
				style={{ gridArea: "bottom" }}
				className="min-w-0 border-neutral-800 border-t"
			>
				{showBottom && (
					<div className="flex h-full min-w-0">
						<div className="min-w-0 flex-1 border-neutral-800 border-r p-2 text-neutral-200 text-xs">
							chat
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
