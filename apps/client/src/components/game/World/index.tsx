import { Color } from "pixi.js";
import { useCallback, useEffect, useMemo } from "react";
import {
	MAX_SCALE,
	TILE_SIZE_PX,
	VIEW_TILES_X,
	VIEW_TILES_Y,
} from "@/sdk/constants";
import { usePixiScreen } from "@/sdk/hooks/usePixiScreen";
import { useDragStore } from "@/sdk/store/drag";
import { useGameStore } from "@/sdk/store/game";
import { startMovementSystem } from "@/sdk/systems/movement";
import { getViewTiles } from "@/sdk/systems/tiles";
import type { Position } from "@/sdk/types/position";

export function World() {
	const tiles = useGameStore((s) => s.tiles);
	const initTestMap = useGameStore((s) => s.initTestMap);
	const playerPosition = useGameStore((s) => s.playerPosition);
	const setMoveTarget = useGameStore((s) => s.setMoveTarget);
	const moveTarget = useGameStore((s) => s.moveTarget);
	const setViewport = useDragStore((s) => s.setViewport);
	const startDrag = useDragStore((s) => s.startDrag);
	const groundItem = { itemId: "A", vx: 7, vy: 5 };
	const target = useDragStore((s) => s.target);
	const canDrop = useDragStore((s) => s.canDrop);

	const worldHover = target?.zone === "WORLD" ? target.tile : null;

	useEffect(() => {
		if (tiles.size === 0) initTestMap();
	}, [initTestMap, tiles.size]);

	useEffect(() => {
		startMovementSystem();
	}, []);

	const { width, height } = usePixiScreen();

	const viewTiles = useMemo(
		() => getViewTiles(playerPosition, tiles),
		[playerPosition, tiles],
	);

	const handleTileClick = useCallback(
		(position: Position) => setMoveTarget(position),
		[setMoveTarget],
	);

	const logicalWidth = VIEW_TILES_X * TILE_SIZE_PX; // 480
	const logicalHeight = VIEW_TILES_Y * TILE_SIZE_PX; // 352

	const scale = Math.min(
		width / logicalWidth,
		height / logicalHeight,
		MAX_SCALE,
	);
	const offsetX = (width - logicalWidth * scale) / 2;
	const offsetY = (height - logicalHeight * scale) / 2;

	useEffect(() => {
		setViewport({
			stageW: width,
			stageH: height,
			scale,
			offsetX,
			offsetY,
		});
	}, [width, height, scale, offsetX, offsetY, setViewport]);

	if (width <= 0 || height <= 0) return null;

	return (
		<pixiContainer x={offsetX} y={offsetY} scale={scale}>
			{viewTiles.map((tile) => {
				const isPlayerTile =
					tile.position.x === playerPosition.x &&
					tile.position.y === playerPosition.y &&
					tile.position.z === playerPosition.z;

				const isTargetTile =
					tile.position.x === moveTarget?.x &&
					tile.position.y === moveTarget?.y &&
					tile.position.z === moveTarget?.z;

				const vx =
					tile.position.x - (playerPosition.x - Math.floor(VIEW_TILES_X / 2));
				const vy =
					tile.position.y - (playerPosition.y - Math.floor(VIEW_TILES_Y / 2));

				const x = vx * TILE_SIZE_PX;
				const y = vy * TILE_SIZE_PX;

				return [
					<pixiGraphics
						key={`g:${tile.position.x}:${tile.position.y}:${tile.position.z}`}
						eventMode="static"
						draw={(g) => {
							g.clear();
							let color = 0x3b4048;
							if (isPlayerTile) color = 0x2f3640;
							if (isTargetTile) color = 0x40586b;

							g.rect(x, y, TILE_SIZE_PX, TILE_SIZE_PX)
								.stroke({
									color: new Color("white").setAlpha(1),
									pixelLine: true,
								})
								.fill(color);
						}}
						onPointerDown={() => handleTileClick(tile.position)}
					/>,
					// <pixiText
					// 	key={`t:${tile.position.x}:${tile.position.y}:${tile.position.z}`}
					// 	text={`${tile.position.x},${tile.position.y},${tile.position.z}`}
					// 	x={x + 2}
					// 	y={y + 2}
					// 	scale={0.4}
					// 	style={{
					// 		fill: "#ffffff",
					// 		fontSize: 10,
					// 		fontFamily: "monospace",
					// 	}}
					// />,
				];
			})}
			<pixiGraphics
				eventMode="static"
				cursor="grab"
				draw={(g) => {
					g.clear();
					const x = groundItem.vx * TILE_SIZE_PX;
					const y = groundItem.vy * TILE_SIZE_PX;
					g.rect(x + 8, y + 8, 16, 16).fill(0xffcc00);
				}}
				onPointerDown={(e: any) => {
					const oe = e.data.originalEvent as PointerEvent;
					startDrag(
						{ kind: "ITEM", itemId: groundItem.itemId, from: "WORLD" },
						{ x: oe.clientX, y: oe.clientY },
						{ label: `WorldItem ${groundItem.itemId}` },
					);
				}}
			/>
			{worldHover && (
				<pixiGraphics
					key={`hover:${worldHover.vx}:${worldHover.vy}`}
					draw={(g) => {
						g.clear();
						const x = worldHover.vx * TILE_SIZE_PX;
						const y = worldHover.vy * TILE_SIZE_PX;
						const strokeColor = canDrop ? 0x00ff66 : 0xff3355;

						g.rect(x, y, TILE_SIZE_PX, TILE_SIZE_PX).stroke({
							color: new Color(strokeColor).setAlpha(1),
							pixelLine: true,
						});
					}}
				/>
			)}
		</pixiContainer>
	);
}
