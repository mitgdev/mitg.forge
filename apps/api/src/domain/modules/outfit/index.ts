import fs from "node:fs/promises";
import path from "node:path";
import {
	type Canvas,
	createCanvas,
	loadImage,
	type SKRSContext2D,
} from "@napi-rs/canvas";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import { colorize } from "@/shared/utils/outfit";
import { mounts } from "@/shared/utils/outfit/mounts";
import type { Logger } from "../logging";

type OutfitConfig = {
	files: string[];
	frames: number;
};

type OutfitFrame = {
	frames: number;
	outfit: number;
	direction?: number;
	animation?: number;
	addons?: number;
	colors: {
		head: number;
		body: number;
		legs: number;
		feet: number;
	};
	mount?: number;
	resizeTo64?: boolean;
};

export type OutfitInput = {
	looktype: number;
	addons: number;
	head: number;
	body: number;
	legs: number;
	feet: number;
	direction?: number;
	mount?: number;
};

export type OutfitAnimation = {
	image: string;
	duration: number;
};

@injectable()
export class Outfit {
	private readonly folder = `${process.cwd()}${env.OUTFIT_FOLDER}`;

	constructor(@inject(TOKENS.Logger) private readonly logger: Logger) {}

	private async folderExists(path: string): Promise<boolean> {
		try {
			const stats = await fs.stat(path);
			return stats.isDirectory();
		} catch {
			return false;
		}
	}

	private async outfitConfigFromFolder(
		outfitId: number,
	): Promise<OutfitConfig> {
		const outfitFolderPath = path.join(this.folder, String(outfitId));

		const outfitFolderExists = await this.folderExists(outfitFolderPath);

		if (!outfitFolderExists) {
			return {
				files: [],
				frames: 0,
			};
		}

		const entries = await fs.readdir(outfitFolderPath, { withFileTypes: true });

		const pngFiles = entries
			.filter((file) => file.isFile() && file.name.endsWith(".png"))
			.map((file) => file.name);

		pngFiles.sort();

		const files = pngFiles.map((fileName) =>
			path.join(outfitFolderPath, fileName),
		);

		const uniqueFirstSegments = new Set<number>();

		for (const fileName of pngFiles) {
			const base = fileName.replace(".png", "");
			const [firstSegment] = base.split("_");
			const segmentNumber = Number.parseInt(firstSegment, 10);

			if (!Number.isNaN(segmentNumber)) {
				uniqueFirstSegments.add(segmentNumber);
			}
		}

		const frames = uniqueFirstSegments.size > 0 ? uniqueFirstSegments.size : 1;

		return {
			files,
			frames,
		};
	}

	private async outfitData(
		outfitId: number,
		mount?: boolean,
	): Promise<OutfitConfig | null> {
		let localOutfitId = outfitId;

		if (mount) {
			const localMount = outfitId;

			if (localMount === 0 || localMount >= 65535) {
				localOutfitId = localMount & 0xffff;
			} else if (localMount < 300) {
				const outfitMountedId = mounts[localMount as keyof typeof mounts];

				if (!outfitMountedId) {
					return null;
				}

				localOutfitId = outfitMountedId;
			}
		}

		const { files, frames } = await this.outfitConfigFromFolder(localOutfitId);

		return {
			frames,
			files,
		};
	}

	private async getFrame({
		outfit,
		mount,
		addons,
		colors,
		frames,
		direction = 3,
		animation = 1,
		resizeTo64 = false,
	}: OutfitFrame): Promise<SKRSContext2D | null> {
		let mountState: number;
		let mountId: number;

		if (mount === undefined || mount === 0) {
			mountId = 0;
			mountState = 1;
		} else {
			mountId = mounts[mount as keyof typeof mounts] || 0;
			mountState = 2;
		}

		const outfitImagePath = path.join(
			this.folder,
			String(outfit),
			`${animation}_${mountState}_1_${direction}.png`,
		);

		if (!(await fs.exists(outfitImagePath))) {
			return null;
		}

		const loadedOutfit = await loadImage(outfitImagePath);

		const imageWidth = loadedOutfit.width;
		const imageHeight = loadedOutfit.height;

		let templateCanvas: Canvas | null = null;
		let templateContext: SKRSContext2D | null = null;

		let outfitCanvas = createCanvas(imageWidth, imageHeight);
		const outfitContext = outfitCanvas.getContext("2d");

		const outfitTemplateImagePath = path.join(
			this.folder,
			String(outfit),
			`${animation}_${mountState}_1_${direction}_template.png`,
		);
		outfitContext.drawImage(loadedOutfit, 0, 0);

		if (await fs.exists(outfitTemplateImagePath)) {
			templateCanvas = createCanvas(imageWidth, imageHeight);
			templateContext = templateCanvas.getContext("2d");
			templateContext.drawImage(await loadImage(outfitTemplateImagePath), 0, 0);
		}

		if (addons === 1 || addons === 3) {
			const addon1ImagePath = path.join(
				this.folder,
				String(outfit),
				`${animation}_${mountState}_2_${direction}.png`,
			);

			if (await fs.exists(addon1ImagePath)) {
				const loadedAddon1 = await loadImage(addon1ImagePath);
				outfitContext.drawImage(loadedAddon1, 0, 0);

				const addon1TemplateImagePath = path.join(
					this.folder,
					String(outfit),
					`${animation}_${mountState}_2_${direction}_template.png`,
				);

				if (templateContext && (await fs.exists(addon1TemplateImagePath))) {
					templateContext.drawImage(
						await loadImage(addon1TemplateImagePath),
						0,
						0,
					);
				}
			}
		}

		if (addons === 2 || addons === 3) {
			const addon2ImagePath = path.join(
				this.folder,
				String(outfit),
				`${animation}_${mountState}_3_${direction}.png`,
			);

			if (await fs.exists(addon2ImagePath)) {
				const loadedAddon2 = await loadImage(addon2ImagePath);
				outfitContext.drawImage(loadedAddon2, 0, 0);

				const addon2TemplateImagePath = path.join(
					this.folder,
					String(outfit),
					`${animation}_${mountState}_3_${direction}_template.png`,
				);

				if (templateContext && (await fs.exists(addon2TemplateImagePath))) {
					templateContext.drawImage(
						await loadImage(addon2TemplateImagePath),
						0,
						0,
					);
				}
			}
		}

		templateCanvas && colorize(templateCanvas, outfitCanvas, colors);

		let mountAnimationFrame = animation;
		while (mountAnimationFrame > frames) {
			mountAnimationFrame -= frames;
		}

		if (mountState === 2) {
			const mountImagePath = path.join(
				this.folder,
				String(mountId),
				`${mountAnimationFrame}_1_1_${direction}.png`,
			);

			if (await fs.exists(mountImagePath)) {
				const mountImage = await loadImage(mountImagePath);
				const mountCanvas = createCanvas(imageWidth, imageHeight);
				const mountCtx = mountCanvas.getContext("2d");
				mountCtx.clearRect(0, 0, imageWidth, imageHeight);
				mountCtx.drawImage(mountImage, 0, 0);
				mountCtx.drawImage(outfitCanvas, 0, 0);
				outfitCanvas = mountCanvas;
			}
		}

		const imageOutfitCanvas = createCanvas(
			resizeTo64 ? 64 : imageWidth,
			resizeTo64 ? 64 : imageHeight,
		);
		const imageOutfitContext = imageOutfitCanvas.getContext("2d");
		imageOutfitContext.clearRect(0, 0, imageWidth, imageHeight);
		imageOutfitContext.globalCompositeOperation = "destination-in";
		imageOutfitContext.drawImage(
			outfitCanvas,
			imageOutfitCanvas.width - imageWidth,
			imageOutfitCanvas.height - imageHeight,
		);
		imageOutfitContext.globalCompositeOperation = "source-over";
		imageOutfitContext.globalAlpha = 1;

		imageOutfitContext.clearRect(
			0,
			0,
			imageOutfitCanvas.width,
			imageOutfitCanvas.height,
		);
		imageOutfitContext.drawImage(
			outfitCanvas,
			imageOutfitCanvas.width - imageWidth,
			imageOutfitCanvas.height - imageHeight,
		);

		return imageOutfitContext;
	}

	async getOutfit(outfit: OutfitInput): Promise<{
		frames: OutfitAnimation[];
	} | null> {
		const folderExists = await this.folderExists(this.folder);

		if (!folderExists) {
			this.logger.error(`Outfit folder does not exist at path: ${this.folder}`);
			return null;
		}

		const data = await this.outfitData(outfit.looktype);

		if (!data) {
			return null;
		}

		const frameContexts: SKRSContext2D[] = [];

		for (let frameIndex = 1; frameIndex <= data.frames; frameIndex++) {
			const frameContext = await this.getFrame({
				frames: data.frames,
				outfit: outfit.looktype,
				animation: frameIndex,
				addons: outfit.addons,
				direction: outfit.direction,
				mount: outfit.mount,
				colors: {
					head: outfit.head,
					body: outfit.body,
					legs: outfit.legs,
					feet: outfit.feet,
				},
				resizeTo64: true,
			});

			if (frameContext) {
				frameContexts.push(frameContext);
			}
		}

		if (frameContexts.length === 0) {
			return null;
		}

		const perFrameDuration = Math.round(100 * (8 / data.frames));

		return {
			frames: frameContexts.map((ctx) => ({
				image: ctx.canvas.toDataURL(),
				duration: perFrameDuration,
			})),
		};
	}
}
