import { Container, Sprite, Texture } from "pixi.js";
import {
	RENDER_PAD,
	RENDER_TILES_X,
	RENDER_TILES_Y,
	TILE_SIZE_PX,
} from "@/sdk/constants";
import { useWorldStore } from "@/sdk/store/world";

export class GroundLayer {
	private readonly tileSize: number = TILE_SIZE_PX;
	private readonly viewX: number = RENDER_TILES_X;
	private readonly viewY: number = RENDER_TILES_Y;
	private readonly pad: number = RENDER_PAD;

	container = new Container();
	private sprites: Sprite[] = [];

	constructor() {
		const total = this.viewX * this.viewY;

		for (let i = 0; i < total; i++) {
			const sprite = new Sprite(Texture.WHITE);
			sprite.width = this.tileSize;
			sprite.height = this.tileSize;

			const vx = i % this.viewX;
			const vy = Math.floor(i / this.viewX);

			// 🔥 render buffer: desloca a grade pra existir "fora" do viewport visível
			sprite.x = (vx - this.pad) * this.tileSize;
			sprite.y = (vy - this.pad) * this.tileSize;
			sprite.tint = 0x000000;

			this.sprites.push(sprite);
			this.container.addChild(sprite);
		}
	}

	/**
	 * originX/originY são do viewport visível (15x11), centrado no player.
	 * A layer renderiza viewX/viewY (ex: 17x13) usando pad.
	 */
	update(originX: number, originY: number, z: number) {
		const tiles = useWorldStore.getState().tiles;

		for (let vy = 0; vy < this.viewY; vy++) {
			for (let vx = 0; vx < this.viewX; vx++) {
				const idx = vy * this.viewX + vx;
				const sprite = this.sprites[idx];

				const worldX = originX + (vx - this.pad);
				const worldY = originY + (vy - this.pad);

				const tile = tiles.get(`${worldX}:${worldY}:${z}`);
				sprite.tint = tile?.groundTint ?? 0x000000;
			}
		}
	}

	getSpriteCount() {
		return this.sprites.length;
	}

	destroy() {
		this.container.destroy({ children: true });
		this.sprites = [];
	}
}
