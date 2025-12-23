import { Application, extend } from "@pixi/react";
import { Container, Graphics as PixiGraphics, Sprite } from "pixi.js";
import { ResizeBridge } from "@/components/game/ResizeBridge";
import { World } from "@/components/game/World";

extend({ Container, Graphics: PixiGraphics, Sprite });

export function GameStage({
	resizeTo,
}: {
	resizeTo: React.RefObject<HTMLElement | null>;
}) {
	return (
		<Application
			resizeTo={resizeTo}
			antialias
			autoStart
			sharedTicker
			powerPreference="high-performance"
			backgroundColor={0x000000}
			resolution={window.devicePixelRatio}
			autoDensity
		>
			<ResizeBridge resizeTo={resizeTo} />
			<World />
		</Application>
	);
}
