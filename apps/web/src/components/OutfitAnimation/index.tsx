import { useEffect, useRef } from "react";
import { useOutfitAnimation } from "@/sdk/hooks/useOutfitAnimation";
import { cn } from "@/sdk/utils/cn";

type Frame = { image: string; duration: number };

type Props = {
	frames: Frame[];
	width?: number;
	height?: number;
	className?: string;
	showNotFoundImage?: boolean;
	loading?: boolean;
};

const bitmapCache = new Map<string, Promise<ImageBitmap>>();

function dataUrlToBlob(dataUrl: string): Blob {
	const [meta, b64] = dataUrl.split(",", 2);
	const mimeMatch = meta.match(/data:(.*?);base64/);
	const mime = mimeMatch?.[1] ?? "application/octet-stream";

	const binary = atob(b64);
	const len = binary.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

	return new Blob([bytes], { type: mime });
}

function getBitmap(src: string) {
	const cached = bitmapCache.get(src);
	if (cached) return cached;

	const p = (async () => {
		const blob = dataUrlToBlob(src);
		return await createImageBitmap(blob);
	})();

	bitmapCache.set(src, p);

	// opcional: limite pra não crescer infinito
	if (bitmapCache.size > 300) {
		const firstKey = bitmapCache.keys().next().value as string | undefined;
		if (firstKey) bitmapCache.delete(firstKey);
	}

	return p;
}

export const OutfitAnimation = ({
	frames,
	width = 64,
	height = 64,
	className,
	showNotFoundImage = true,
	loading = false,
}: Props) => {
	const { frame } = useOutfitAnimation(frames);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const src = frame?.image;
		const canvas = canvasRef.current;
		if (!src || !canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let cancelled = false;

		(async () => {
			const bmp = await getBitmap(src);
			if (cancelled) return;

			ctx.clearRect(0, 0, width, height);
			ctx.imageSmoothingEnabled = false; // pixel art
			ctx.drawImage(bmp, 0, 0, width, height);
		})();

		return () => {
			cancelled = true;
		};
	}, [frame?.image, width, height]);

	if (loading) return null;
	if (showNotFoundImage === false && !frames.length) return null;

	if (!frames.length || !frame) {
		return (
			<div className={cn("flex h-full w-full items-center justify-center")}>
				<img
					src="/assets/outfits/not-found.svg"
					width={32}
					height={32}
					alt="Not found"
				/>
			</div>
		);
	}

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			className={cn(className)}
			style={{
				width: `${width}px`,
				height: `${height}px`,
				imageRendering: "pixelated",
			}}
		/>
	);
};
