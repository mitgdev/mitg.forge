import { Application, extend } from "@pixi/react";
import { Container, Graphics as PixiGraphics } from "pixi.js";
import { type JSX, useCallback, useEffect, useMemo, useState } from "react";
import { useGameStore } from "../store/game";

extend({ Container, Graphics: PixiGraphics });

type HoveredTile = { tx: number; ty: number } | null;

export function GameStage() {
	const {
		tileSize,
		worldWidth,
		worldHeight,
		viewWidth,
		viewHeight,
		player,
		camera,
		movePlayer,
		setDestination,
	} = useGameStore();

	const [hoveredTile, setHoveredTile] = useState<HoveredTile>(null);

	const baseWidth = viewWidth * tileSize;
	const baseHeight = viewHeight * tileSize;

	const worldOffsetX = -camera.cx * tileSize;
	const worldOffsetY = -camera.cy * tileSize;

	// teclado (igual antes)
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			switch (e.key) {
				case "w":
				case "ArrowUp":
					movePlayer(0, -1);
					break;
				case "s":
				case "ArrowDown":
					movePlayer(0, 1);
					break;
				case "a":
				case "ArrowLeft":
					movePlayer(-1, 0);
					break;
				case "d":
				case "ArrowRight":
					movePlayer(1, 0);
					break;
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [movePlayer]);

	// desenhar tiles visíveis, já com hover/click
	const tiles = useMemo(() => {
		const res: JSX.Element[] = [];

		for (let ty = camera.cy; ty < camera.cy + viewHeight; ty++) {
			for (let tx = camera.cx; tx < camera.cx + viewWidth; tx++) {
				if (tx < 0 || ty < 0 || tx >= worldWidth || ty >= worldHeight) continue;

				const x = tx * tileSize;
				const y = ty * tileSize;

				const isHovered = hoveredTile?.tx === tx && hoveredTile?.ty === ty;

				res.push(
					<pixiGraphics
						key={`tile-${tx}-${ty}`}
						x={x}
						y={y}
						eventMode="static"
						// hover
						onPointerOver={() => setHoveredTile({ tx, ty })}
						onPointerOut={() =>
							setHoveredTile((current) =>
								current?.tx === tx && current?.ty === ty ? null : current,
							)
						}
						// click
						onPointerTap={() => {
							// aqui você manda o personagem ir até esse tile
							setDestination(tx, ty);
						}}
						draw={(g: PixiGraphics) => {
							g.clear();

							const isOdd = (tx + ty) % 2 === 1;
							const baseColor = isOdd ? 0x222222 : 0x333333;

							g.setFillStyle({
								color: baseColor,
							});
							g.rect(0, 0, tileSize, tileSize);
							g.fill();

							// borda normal
							g.setStrokeStyle({
								color: 0x444444,
								width: 1,
							});
							g.rect(0, 0, tileSize, tileSize);
							g.stroke();

							// se estiver hover, desenha uma borda extra (efeito Tibia)
							if (isHovered) {
								g.setStrokeStyle({
									color: 0xffff00, // amarelo
									width: 2,
								});
								g.rect(1, 1, tileSize - 2, tileSize - 2);
								g.stroke();
							}
						}}
					/>,
				);
			}
		}

		return res;
	}, [
		camera.cx,
		camera.cy,
		viewHeight,
		viewWidth,
		worldWidth,
		worldHeight,
		tileSize,
		hoveredTile,
		movePlayer,
	]);

	// player
	const playerPixelX = player.tx * tileSize;
	const playerPixelY = player.ty * tileSize;

	const drawPlayer = useCallback(
		(g: PixiGraphics) => {
			g.clear();
			g.setFillStyle({ color: 0xffffff });
			g.rect(4, 4, tileSize - 8, tileSize - 8);
			g.fill();
		},
		[tileSize],
	);

	return (
		<Application
			width={baseWidth}
			height={baseHeight}
			autoStart
			sharedTicker
			backgroundColor={0x000000}
		>
			{/* container raiz com zoom, como antes */}
			<pixiContainer x={baseWidth / 2} y={baseHeight / 2}>
				<pixiContainer
					x={worldOffsetX - baseWidth / 2}
					y={worldOffsetY - baseHeight / 2}
				>
					{/* tiles interativos */}
					{tiles}

					{/* player */}
					<pixiGraphics x={playerPixelX} y={playerPixelY} draw={drawPlayer} />
				</pixiContainer>
			</pixiContainer>
		</Application>
	);
}
