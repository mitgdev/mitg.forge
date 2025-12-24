import { useLayoutEffect, useRef } from "react";
import { PixiHost } from "@/components/game/PixiHost";
import { useWorldStore } from "@/sdk/store/world";

type Props = { gridArea?: string };

export function GameCanvas({ gridArea }: Props) {
	const parentRef = useRef<HTMLDivElement>(null);
	const setWorldElement = useWorldStore((s) => s.setWorldElement);

	useLayoutEffect(() => {
		setWorldElement(parentRef.current);
		return () => setWorldElement(null);
	}, [setWorldElement]);

	return (
		<div
			ref={parentRef}
			style={{
				gridArea,
				backgroundImage: "url(/textures/background.png)",
				backgroundRepeat: "repeat",
				backgroundSize: "64px 64px",
			}}
			className="relative min-h-0 min-w-0 overflow-hidden"
		>
			<PixiHost />
		</div>
	);
}
