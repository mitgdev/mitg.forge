import { Container, Graphics } from "pixi.js";
import { TILE_SIZE_PX } from "@/sdk/constants";
import { useViewportStore } from "@/sdk/store/viewport";

export class OverlayLayer {
	container = new Container();
	private graphic = new Graphics();

	constructor() {
		this.container.addChild(this.graphic);
	}

	update() {
		const hovered = useViewportStore.getState().hoveredTile;

		this.graphic.clear();

		if (!hovered) return;

		const x = hovered.vx * TILE_SIZE_PX;
		const y = hovered.vy * TILE_SIZE_PX;

		this.graphic.rect(x, y, TILE_SIZE_PX, TILE_SIZE_PX).fill({
			color: 0xffff00,
			alpha: 0.1,
		});

		this.graphic
			.rect(x + 0.5, y + 0.5, TILE_SIZE_PX - 1, TILE_SIZE_PX - 1)
			.stroke({
				color: 0xffd400,
				width: 1,
				pixelLine: true,
			});
	}

	destroy() {
		this.container.destroy({ children: true });
	}
}
