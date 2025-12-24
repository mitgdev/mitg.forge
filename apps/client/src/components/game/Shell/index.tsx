import { useMemo } from "react";
import { Panel } from "@/components/ui/Panel";
import { MIN_GAME_WIDTH, PANEL_WIDTH } from "@/sdk/constants";
import { GameCanvas } from "../Canvas";

const LEFT1 = true;
const LEFT2 = true;
const RIGHT1 = false;
const RIGHT2 = true;
const RIGHT3 = true;

export const GameShell = () => {
	const gridTemplateColumns = useMemo(
		() =>
			[
				LEFT1 ? `${PANEL_WIDTH}px` : "0px",
				LEFT2 ? `${PANEL_WIDTH}px` : "0px",
				`minmax(${MIN_GAME_WIDTH}px, 1fr)`, // centro sempre >= 240px
				RIGHT1 ? `${PANEL_WIDTH}px` : "0px",
				RIGHT2 ? `${PANEL_WIDTH}px` : "0px",
				RIGHT3 ? `${PANEL_WIDTH}px` : "0px",
			].join(" "),
		[],
	);

	return (
		<div
			className="h-screen w-screen overflow-hidden bg-neutral-900"
			style={{
				display: "grid",
				gridTemplateColumns,
				gridTemplateRows: "1fr",
				gridTemplateAreas: '"left1 left2 center right1 right2 right3"',
			}}
		>
			{/* LEFT PANELS */}
			<Panel area="left1" border="right">
				{LEFT1 && (
					<div className="h-full p-2 text-neutral-200 text-xs">
						Panel Left 1
					</div>
				)}
			</Panel>
			<Panel area="left2" border="right">
				{LEFT2 && (
					<div className="h-full p-2 text-neutral-200 text-xs">
						Panel Left 2
					</div>
				)}
			</Panel>
			{/* CENTER: grid INTERNO com health / game / bottom */}
			<div
				style={{ gridArea: "center" }}
				className="h-full min-h-0 w-full min-w-0"
			>
				<CenterColumn showHealth={true} showBottom={true}>
					<GameCanvas gridArea="game" />
				</CenterColumn>
			</div>

			<Panel area="right1" border="left">
				{RIGHT1 && (
					<div className="h-full p-2 text-neutral-200 text-xs">
						<span>Right 1</span>
					</div>
				)}
			</Panel>

			<Panel area="right2" border="left">
				{RIGHT2 && (
					<div className="h-full p-2 text-neutral-200 text-xs">Right 2</div>
				)}
			</Panel>

			<Panel area="right3" border="left">
				{RIGHT3 && (
					<div className="h-full p-2 text-neutral-200 text-xs">Right 3</div>
				)}
			</Panel>
		</div>
	);
};

const MIN_HEALTH = 40;
const MAX_HEALTH = 60;

const MIN_BOTTOM = 120;
const MAX_BOTTOM = 180;

type CenterColumnProps = {
	showHealth: boolean;
	showBottom: boolean;
	children: React.ReactNode;
};

export function CenterColumn({
	showHealth,
	showBottom,
	children,
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
			<Panel area="health" border="bottom" className="text-sm text-white">
				{showHealth && <span>HP/MP bar aqui</span>}
			</Panel>

			{children}

			<Panel area="bottom" border="top" className="text-sm text-white">
				{showBottom && <span>Teste Bottom Panel</span>}
			</Panel>
		</div>
	);
}
