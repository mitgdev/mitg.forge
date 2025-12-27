import { type Application, Container, Graphics, Rectangle } from "pixi.js";
import { createDemoMapLoader } from "@/sdk/demo/demoMapLoader";
import {
	MAX_SCALE,
	RENDER_PAD,
	RENDER_TILES_X,
	RENDER_TILES_Y,
	TILE_SIZE_PX,
	VIEW_TILES_X,
	VIEW_TILES_Y,
} from "../constants";
import { useDebugStore } from "../store/debug";
import { useMovementStore } from "../store/movement";
import { useViewportStore } from "../store/viewport";
import { makeKeyFromPosition, useWorldStore } from "../store/world";
import { CreatureLayer } from "./layers/CreatureLayer";
import { DebugGridLayer } from "./layers/DebugGridLayer";
import { GroundLayer } from "./layers/GroundLayer";
import { ItemTestLayer } from "./layers/ItemLayer";
import { OverlayLayer } from "./layers/OverlayLayer";
import { WorldPerfSampler } from "./utils/WorldPerfSamples";

const demo = createDemoMapLoader();

export class World {
	private app: Application;

	private perf = new WorldPerfSampler(250);

	private rootView = new Container();
	private clip = new Container();
	private clipMask = new Graphics();
	private camera = new Container();

	private scale = 1;
	private offsetX = 0;
	private offsetY = 0;

	private ground: GroundLayer;
	private items: ItemTestLayer;
	private creatures: CreatureLayer;
	private overlay: OverlayLayer;
	private debug: DebugGridLayer;

	private tilesDirty = true;
	private creaturesDirty = true;
	private viewDirty = true;
	private unsubs: Array<() => void> = [];

	constructor(app: Application) {
		this.app = app;

		this.app.stage.addChild(this.rootView);
		this.rootView.addChild(this.clipMask);
		this.rootView.addChild(this.clip);
		this.clip.mask = this.clipMask;
		this.clip.addChild(this.camera);

		this.ground = new GroundLayer();
		this.items = new ItemTestLayer();
		this.creatures = new CreatureLayer();

		this.overlay = new OverlayLayer();
		this.debug = new DebugGridLayer();

		// ordem: chão -> criaturas -> overlay -> debug
		this.camera.addChild(this.ground.container);
		this.camera.addChild(this.items.container);
		this.camera.addChild(this.creatures.container);
		this.camera.addChild(this.overlay.container);
		this.camera.addChild(this.debug.container);

		this.app.stage.eventMode = "static";
		this.app.stage.hitArea = new Rectangle(
			0,
			0,
			this.app.screen.width,
			this.app.screen.height,
		);

		this.unsubs.push(
			useWorldStore.subscribe((s, p) => {
				if (s.tilesVersion !== p.tilesVersion) this.tilesDirty = true;
				if (s.creaturesVersion !== p.creaturesVersion)
					this.creaturesDirty = true;
			}),
		);

		this.unsubs.push(
			useMovementStore.subscribe((s, p) => {
				const a = makeKeyFromPosition(s.playerTile);
				const b = makeKeyFromPosition(p.playerTile);
				if (a !== b) this.viewDirty = true;
			}),
		);
	}

	resize(width: number, height: number) {
		this.app.stage.hitArea = new Rectangle(0, 0, width, height);

		const viewW = VIEW_TILES_X * TILE_SIZE_PX;
		const viewH = VIEW_TILES_Y * TILE_SIZE_PX;

		this.scale = Math.min(width / viewW, height / viewH, MAX_SCALE);

		const rawOffsetX = (width - viewW * this.scale) / 2;
		const rawOffsetY = (height - viewH * this.scale) / 2;

		this.offsetX = Math.round(rawOffsetX);
		this.offsetY = Math.round(rawOffsetY);

		this.rootView.position.set(this.offsetX, this.offsetY);
		this.rootView.scale.set(this.scale);

		this.clipMask.clear().rect(0, 0, viewW, viewH).fill(0xffffff);
		const cam = useMovementStore.getState().cameraPx;

		const player = useMovementStore.getState().playerTile;
		const halfX = Math.floor(VIEW_TILES_X / 2);
		const halfY = Math.floor(VIEW_TILES_Y / 2);

		const originX = player.x - halfX;
		const originY = player.y - halfY;

		useViewportStore.getState().setViewport({
			stageWidth: width,
			stageHeight: height,

			scale: this.scale,
			offsetX: this.offsetX,
			offsetY: this.offsetY,

			cameraX: cam.x,
			cameraY: cam.y,

			originX,
			originY,
			z: player.z,

			viewW,
			viewH,
			viewTilesX: VIEW_TILES_X,
			viewTilesY: VIEW_TILES_Y,
			tileSize: TILE_SIZE_PX,
		});

		this.viewDirty = true;
	}

	update(nowMs: number, _deltaMs: number) {
		this.perf.frame();
		const tWorld = this.perf.begin();
		useMovementStore.getState().tick(nowMs);

		const playerTile = useMovementStore.getState().playerTile;
		const player = playerTile;
		const cameraPx = useMovementStore.getState().cameraPx;

		this.camera.x = cameraPx.x;
		this.camera.y = cameraPx.y;

		const halfX = Math.floor(VIEW_TILES_X / 2);
		const halfY = Math.floor(VIEW_TILES_Y / 2);
		const originX = player.x - halfX;
		const originY = player.y - halfY;

		useViewportStore.getState().patchViewport({
			originX,
			originY,
			z: player.z,
			cameraX: this.camera.x,
			cameraY: this.camera.y,
		});

		demo.ensureForView({
			originX: originX - RENDER_PAD,
			originY: originY - RENDER_PAD,
			z: player.z,
			viewW: VIEW_TILES_X + RENDER_PAD * 2,
			viewH: VIEW_TILES_Y + RENDER_PAD * 2,
			paddingTiles: 16,
		});

		const show = useDebugStore.getState().showGrid;
		this.debug.setVisible(show);

		if (show && (this.viewDirty || this.tilesDirty || this.creaturesDirty)) {
			this.debug.update(originX, originY, player.z);
		}

		if (this.tilesDirty || this.viewDirty) {
			this.ground.update(originX, originY, player.z);
			this.items.update();
			this.tilesDirty = false;
		}

		if (this.creaturesDirty || this.viewDirty) {
			this.creatures.update(
				originX,
				originY,
				player.z,
				RENDER_TILES_X,
				RENDER_TILES_Y,
			);
			this.creaturesDirty = false;
		}

		// overlay é barato, pode atualizar sempre
		this.overlay.update();

		this.viewDirty = false;
		this.perf.end("world", tWorld);
		this.perf.flushIfDue({
			groundSprites: this.ground.getSpriteCount?.() ?? 0,
			creaturesTotal: this.creatures.getTotalCreatures?.() ?? 0,
			creaturesVisible: 0,
			tilesInCache: useWorldStore.getState().tiles.size,

			viewDirty: this.viewDirty,
			tilesDirty: this.tilesDirty,
			creaturesDirty: this.creaturesDirty,
		});
	}

	destroy() {
		this.unsubs.forEach((fn) => {
			fn();
		});
		this.unsubs = [];

		this.ground.destroy();
		this.items.destroy();
		this.creatures.destroy();
		this.overlay.destroy();
		this.debug.destroy();

		this.rootView.destroy({ children: true });
	}
}
