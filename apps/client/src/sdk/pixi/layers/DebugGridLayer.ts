import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { TILE_SIZE_PX, VIEW_TILES_X, VIEW_TILES_Y } from "@/sdk/constants";

export class DebugGridLayer {
	private readonly viewX: number = VIEW_TILES_X;
	private readonly viewY: number = VIEW_TILES_Y;
	private readonly tileSize: number = TILE_SIZE_PX;

	container = new Container();

	private grid = new Graphics();
	private center = new Graphics();
	private labels: Text[] = [];

	private lastOriginX = Number.NaN;
	private lastOriginY = Number.NaN;
	private lastZ = Number.NaN;
	private lastVisible = true;

	private style = new TextStyle({
		fontFamily: "monospace",
		fontSize: 10,
		fill: 0xffffff,
		align: "left",
	});

	constructor() {
		this.container.addChild(this.grid);
		this.container.addChild(this.center);

		// labels (opcional, mas útil)
		const total = this.viewX * this.viewY;
		for (let i = 0; i < total; i++) {
			const text = new Text({ text: "", style: this.style, scale: 0.6 });
			text.alpha = 0.6;
			text.visible = false; // só mostra se enabled
			this.labels.push(text);
			this.container.addChild(text);
		}

		this.drawGridLines();
		this.drawCenterTile();
	}

	setVisible(v: boolean) {
		if (this.lastVisible === v) return;
		this.lastVisible = v;
		this.container.visible = v;
	}

	/** Atualiza os textos de coordenadas (só quando a janela muda) */
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

		// contorno DENTRO da área visível
		this.grid.rect(0.5, 0.5, w - 1, h - 1);

		// linhas internas (sem desenhar na borda)
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

		const x = cx * this.tileSize;
		const y = cy * this.tileSize;

		this.center
			.rect(x, y, this.tileSize, this.tileSize)
			.stroke({ color: 0x00ff88, width: 1, alpha: 0.9, pixelLine: true });
	}
}
