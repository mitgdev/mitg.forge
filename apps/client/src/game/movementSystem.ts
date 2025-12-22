import { Ticker } from "pixi.js";
import { useGameStore } from "../store/game";

let started = false;

export function startMovementSystem() {
	if (started) return;
	started = true;

	const ticker = Ticker.shared;
	const stepIntervalMs = 120; // tempo por "sqm"
	let accumulator = 0;

	ticker.add((delta) => {
		// delta ~ 1 a 60 FPS
		const dtMs = delta * (1000 / 60);
		accumulator += dtMs;

		if (accumulator < stepIntervalMs) return;
		accumulator -= stepIntervalMs;

		const { stepTowardsDestination } = useGameStore.getState();
		stepTowardsDestination();
	});
}
