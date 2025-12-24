import { Container, Sprite, Texture } from "pixi.js";
import { RENDER_PAD, TILE_SIZE_PX } from "@/sdk/constants";
import { useWorldStore } from "@/sdk/store/world";
import { SpritePool } from "../utils/SpritePool";

export class CreatureLayer {
	private readonly tileSize: number = TILE_SIZE_PX;
	private readonly renderPad: number = RENDER_PAD;

	container = new Container();
	private pool: SpritePool;

	constructor() {
		this.container.sortableChildren = true;

		this.pool = new SpritePool(() => {
			const s = new Sprite(Texture.WHITE);
			s.width = this.tileSize;
			s.height = this.tileSize;
			s.visible = false;
			return s;
		}, 64);
	}

	/**
	 * originX/originY são do viewport visível (15x11).
	 * viewX/viewY aqui são os RENDER_TILES_* (ex: 17x13) e pad = 1.
	 */
	update(
		originX: number,
		originY: number,
		z: number,
		viewX: number,
		viewY: number,
	) {
		const creatures = useWorldStore.getState().creatures;

		// janelas renderizáveis em relação ao origin visível
		const minRelX = -this.renderPad;
		const minRelY = -this.renderPad;
		const maxRelX = viewX - 1 - this.renderPad; // ex 16-1=15
		const maxRelY = viewY - 1 - this.renderPad; // ex 12-1=11

		const alive = new Set<string>();

		for (const c of creatures.values()) {
			if (c.position.z !== z) continue;

			const relX = c.position.x - originX;
			const relY = c.position.y - originY;

			if (
				relX < minRelX ||
				relY < minRelY ||
				relX > maxRelX ||
				relY > maxRelY
			) {
				continue;
			}

			alive.add(c.id);

			const sprite = this.pool.acquire(c.id);

			// posição em pixels no "mundo lógico" (antes do scale/rootView)
			sprite.x = relX * this.tileSize;
			sprite.y = relY * this.tileSize;
			// y-sort simples
			sprite.zIndex = sprite.y;

			// placeholder visual
			sprite.tint = 0xffdddd;

			if (!sprite.parent) this.container.addChild(sprite);
		}

		this.pool.releaseMissing(alive);
	}

	getTotalCreatures() {
		return useWorldStore.getState().creatures.size; // ou o que você usa
	}

	destroy() {
		this.container.destroy({ children: true });
		this.pool.destroy();
	}
}
