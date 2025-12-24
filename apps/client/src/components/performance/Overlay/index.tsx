import { useEffect } from "react";
import { usePerfStore } from "@/sdk/store/performance";

function fmt(n: number, digits = 1) {
	return Number.isFinite(n) ? n.toFixed(digits) : "-";
}

export function PerfOverlay() {
	const enabled = usePerfStore((s) => s.enabled);
	const pixi = usePerfStore((s) => s.pixi);
	const react = usePerfStore((s) => s.react);
	const toggle = usePerfStore((s) => s.toggle);
	const world = usePerfStore((s) => s.world);
	const c = usePerfStore((s) => s.counts);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			// Ctrl+Shift+P pra ligar/desligar
			if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "p") toggle();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [toggle]);

	if (!enabled) return null;

	return (
		<div className="pointer-events-none fixed bottom-2 left-2 z-999999">
			<pre className="whitespace-pre rounded border border-neutral-700 bg-black/75 px-2 py-1 text-[11px] text-neutral-200 leading-4">
				{`PIXI   ${fmt(pixi.fps, 0)} fps | ${fmt(pixi.frameMs, 1)} ms | ${pixi.screenW}x${pixi.screenH} dpr ${fmt(pixi.resolution, 2)}
WORLD  avg ${fmt(world.worldAvgMs, 2)} ms  max ${fmt(world.worldMaxMs, 2)} ms
LAYERS ground ${fmt(world.groundAvgMs, 2)} / ${fmt(world.groundMaxMs, 2)}  | creatures ${fmt(world.creaturesAvgMs, 2)} / ${fmt(world.creaturesMaxMs, 2)}
       overlay ${fmt(world.overlayAvgMs, 2)} / ${fmt(world.overlayMaxMs, 2)} | debug ${fmt(world.debugAvgMs, 2)} / ${fmt(world.debugMaxMs, 2)}
REACT  ${fmt(react.commitsPerSec, 0)}/s | last ${fmt(react.lastCommitMs, 1)} ms | avg ${fmt(react.avgCommitMs, 1)} ms

COUNTS tiles ${c.tilesInCache} | groundSprites ${c.groundSprites} | creatures ${c.creaturesVisible}/${c.creaturesTotal}
DIRTY  view:${c.viewDirty ? "Y" : "n"} tiles:${c.tilesDirty ? "Y" : "n"} creatures:${c.creaturesDirty ? "Y" : "n"}`}
			</pre>
		</div>
	);
}
