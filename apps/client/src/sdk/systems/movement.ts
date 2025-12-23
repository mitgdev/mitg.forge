import { Ticker } from "pixi.js";
import { useGameStore } from "@/sdk/store/game";

let started = false;

export function startMovementSystem() {
	if (started) return;
	started = true;

	const ticker = Ticker.shared;
	let lastTime = performance.now();

	ticker.add(() => {
		const now = performance.now();
		const deltaMs = now - lastTime;
		lastTime = now;

		// update movement via zustand, fora do React
		useGameStore.getState().updateMovement(deltaMs);
	});
}
