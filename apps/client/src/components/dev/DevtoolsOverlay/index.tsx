import { useEffect } from "react";
import { useDevtoolsStore } from "@/sdk/store/devtools";

export function DevtoolsOverlay() {
	const enabled = useDevtoolsStore((s) => s.enabled);
	const toggle = useDevtoolsStore((s) => s.toggle);
	const pixi = useDevtoolsStore((s) => s.pixi);
	const react = useDevtoolsStore((s) => s.react);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			// F2 toggle (bem comum em debug HUD)
			if (e.key === "F2") toggle();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [toggle]);

	if (!enabled) return null;

	return (
		<div
			className="pointer-events-none fixed top-2 left-2 z-[999999] select-none rounded border border-neutral-700 bg-neutral-900/80 p-2 font-mono text-neutral-100 text-xs"
			style={{ minWidth: 220 }}
		>
			<div className="mb-1 font-semibold">DEVTOOLS (F2)</div>

			<div className="mb-2">
				<div className="text-neutral-300">PIXI</div>
				<div>FPS: {pixi ? pixi.fps.toFixed(1) : "-"}</div>
				<div>Frame: {pixi ? pixi.frameMs.toFixed(2) : "-"} ms</div>
				<div>
					Screen: {pixi ? `${pixi.width}×${pixi.height}` : "-"} (dpr{" "}
					{pixi ? pixi.dpr.toFixed(2) : "-"})
				</div>
			</div>

			<div>
				<div className="text-neutral-300">REACT</div>
				<div>Commits/s: {react ? react.commitsPerSec : "-"}</div>
				<div>Avg commit: {react ? react.avgCommitMs.toFixed(2) : "-"} ms</div>
				<div>Last commit: {react ? react.lastCommitMs.toFixed(2) : "-"} ms</div>
			</div>
		</div>
	);
}
