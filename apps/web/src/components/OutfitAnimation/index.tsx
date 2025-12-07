import { useEffect, useRef } from "react";
import { useOutfitAnimation } from "@/sdk/hooks/useOutfitAnimation";
import { cn } from "@/sdk/utils/cn";

type Frame = {
	image: string;
	duration: number;
};

type Props = {
	frames: Frame[];
	width?: number;
	height?: number;
	className?: string;
	showNotFoundImage?: boolean;
};

export const OutfitAnimation = ({
	frames,
	width = 64,
	height = 64,
	className,
	showNotFoundImage = true,
}: Props) => {
	const { frame } = useOutfitAnimation(frames);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (!frame) return;
		if (!canvasRef.current) return;

		const ctx = canvasRef.current.getContext("2d");
		if (!ctx) return;

		const img = new Image();
		img.src = frame.image; // dataURL vindo do backend

		img.onload = () => {
			// limpa o canvas
			ctx.clearRect(0, 0, width, height);
			// desenha a imagem ajustada ao tamanho
			ctx.drawImage(img, 0, 0, width, height);
		};
	}, [frame, width, height]);

	if (showNotFoundImage === false && !frames.length) {
		return null;
	}

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
