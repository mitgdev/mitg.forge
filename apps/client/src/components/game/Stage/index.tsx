import { Application, extend } from "@pixi/react";
import { Container, Graphics as PixiGraphics, Sprite, Text } from "pixi.js";
import { World } from "@/components/game/World";
import { PixiPerfBridge } from "../PixiPerfBridge";
import { ResizeBridge } from "../ResizeBridge";

extend({ Container, Graphics: PixiGraphics, Sprite, Text });
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
			preference="webgpu"
			backgroundColor={0x000000}
			resolution={window.devicePixelRatio}
			autoDensity
		>
			<World />
			<PixiPerfBridge />
			<ResizeBridge resizeTo={resizeTo} />
		</Application>
	);
}
