import { AnimatedSprite, Assets, Container, type Texture } from "pixi.js";
import { TILE_SIZE_PX } from "@/sdk/constants";
import { useViewportStore } from "@/sdk/store/viewport";

export const spriteUrl = (spriteId: number) =>
	`miforge://localhost/sprite/${spriteId}.png`;

async function makeItemAnim(frameSpriteIds: number[], fps = 8) {
	const textures = await Promise.all(
		frameSpriteIds.map((id) => Assets.load<Texture>(spriteUrl(id))),
	);

	const anim = new AnimatedSprite(textures);
	anim.loop = true;
	anim.animationSpeed = fps / 60; // assume 60hz
	anim.play();

	return anim;
}

export class ItemTestLayer {
	container = new Container();

	private anim: AnimatedSprite | null = null;
	private ready = false;

	constructor() {
		void this.load();
	}

	private async load() {
		// ⚠️ Coloque aqui os spriteIds dos frames da animação
		// Ex: 4 frames sequenciais (troque pelos IDs reais)
		const frames = [
			222216, 222217, 222218, 222219, 222220, 222221, 222222, 222223, 222224,
		];

		const anim = await makeItemAnim(frames, 8);

		// opcional: garante pixel-perfect em sprites pixel art
		// (se você já configura isso globalmente, pode remover)
		// anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

		anim.visible = false;

		this.anim = anim;
		this.container.addChild(anim);

		this.ready = true;
	}

	update() {
		const hovered = useViewportStore.getState().hoveredTile;

		if (!hovered || !this.ready || !this.anim) {
			if (this.anim) this.anim.visible = false;
			return;
		}

		this.anim.visible = true;
		this.anim.x = hovered.vx * TILE_SIZE_PX;
		this.anim.y = hovered.vy * TILE_SIZE_PX;
	}

	destroy() {
		this.anim?.destroy();
		this.anim = null;
		this.container.destroy({ children: true });
	}
}
