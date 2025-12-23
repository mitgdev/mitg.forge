import { useLayoutEffect, useRef, useState } from "react";
import { GameStage } from "../Stage";

export function GameCanvas() {
	const parentRef = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);

	// monta UMA vez quando o ref existir (evita remounts e perda de contexto)
	useLayoutEffect(() => {
		if (parentRef.current) setMounted(true);
	}, []);

	return (
		<div
			ref={parentRef}
			className="relative h-full min-h-0 w-full min-w-0 overflow-hidden"
		>
			{mounted && <GameStage resizeTo={parentRef} />}
		</div>
	);
}
