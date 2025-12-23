import { Application, extend } from "@pixi/react";
import { Container, Graphics as PixiGraphics, Sprite } from "pixi.js";
import { World } from "@/components/game/World";
import { ResizeBridge } from "../ResizeBridge";

extend({ Container, Graphics: PixiGraphics, Sprite });

export function GameStage({
	resizeTo,
}: {
	resizeTo: React.RefObject<HTMLElement | null>;
}) {
	return (
		<Application
			antialias
			autoStart
			sharedTicker
			powerPreference="high-performance"
			backgroundColor={0x000000}
			resolution={window.devicePixelRatio}
			autoDensity
		>
			<World />
			<ResizeBridge resizeTo={resizeTo} />
		</Application>
	);
}
