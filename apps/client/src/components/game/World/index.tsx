import { Color } from "pixi.js";
import { useCallback, useEffect, useMemo } from "react";
import {
	MAX_SCALE,
	TILE_SIZE_PX,
	VIEW_TILES_X,
	VIEW_TILES_Y,
} from "@/sdk/constants";
import { usePixiScreen } from "@/sdk/hooks/usePixiScreen";
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

	if (width <= 0 || height <= 0) return null;

	console.log("World render", { width, height, scale, offsetX, offsetY });

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

				return (
					<pixiGraphics
						key={`${tile.position.x}:${tile.position.y}:${tile.position.z}`}
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
					/>
				);
			})}
		</pixiContainer>
	);
}
