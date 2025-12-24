import { BitmapText, Container, Graphics } from "pixi.js";
import { TILE_SIZE_PX, VIEW_TILES_X, VIEW_TILES_Y } from "@/sdk/constants";

export class DebugGridLayer {
	private readonly viewX = VIEW_TILES_X;
	private readonly viewY = VIEW_TILES_Y;
	private readonly tileSize = TILE_SIZE_PX;

	container = new Container();

	private grid = new Graphics();
	private center = new Graphics();
	private labels: BitmapText[] = [];

	private lastOriginX = Number.NaN;
	private lastOriginY = Number.NaN;
	private lastZ = Number.NaN;
	private lastVisible = true;

	constructor() {
		this.container.addChild(this.grid);
		this.container.addChild(this.center);

		const total = this.viewX * this.viewY;

		for (let i = 0; i < total; i++) {
			const t = new BitmapText({
				text: "",
				style: {
					fontFamily: "DebugMono", // mesmo nome definido no .fnt
					fontSize: 8,
					fill: "#ffffff",
				},
			});

			t.alpha = 0.6;
			t.visible = false;

			this.labels.push(t);
			this.container.addChild(t);
		}

		this.drawGridLines();
		this.drawCenterTile();
	}

	setVisible(v: boolean) {
		if (this.lastVisible === v) return;
		this.lastVisible = v;
		this.container.visible = v;
	}

	update(originX: number, originY: number, z: number) {
		if (
			originX === this.lastOriginX &&
			originY === this.lastOriginY &&
			z === this.lastZ
		) {
			return;
		}

		this.lastOriginX = originX;
		this.lastOriginY = originY;
		this.lastZ = z;

		for (let vy = 0; vy < this.viewY; vy++) {
			for (let vx = 0; vx < this.viewX; vx++) {
				const idx = vy * this.viewX + vx;
				const label = this.labels[idx];

				const wx = originX + vx;
				const wy = originY + vy;

				label.visible = true;
				label.text = `${wx},${wy}`;
				label.x = vx * this.tileSize + 2;
				label.y = vy * this.tileSize + 1;
			}
		}
	}

	destroy() {
		this.container.destroy({ children: true });
		this.labels = [];
	}

	private drawGridLines() {
		const w = this.viewX * this.tileSize;
		const h = this.viewY * this.tileSize;

		this.grid.clear();
		this.grid.rect(0.5, 0.5, w - 1, h - 1);

		for (let i = 1; i < this.viewX; i++) {
			const x = i * this.tileSize + 0.5;
			this.grid.moveTo(x, 0.5).lineTo(x, h - 0.5);
		}

		for (let i = 1; i < this.viewY; i++) {
			const y = i * this.tileSize + 0.5;
			this.grid.moveTo(0.5, y).lineTo(w - 0.5, y);
		}

		this.grid.stroke({
			color: 0xffffff,
			width: 1,
			alpha: 0.15,
			pixelLine: true,
		});
	}

	private drawCenterTile() {
		this.center.clear();

		const cx = Math.floor(this.viewX / 2);
		const cy = Math.floor(this.viewY / 2);

		this.center
			.rect(
				cx * this.tileSize,
				cy * this.tileSize,
				this.tileSize,
				this.tileSize,
			)
			.stroke({ color: 0x00ff88, width: 1, alpha: 0.9, pixelLine: true });
	}
}
