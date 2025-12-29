import { usePerfStore } from "@/sdk/store/performance";

type Key = "world" | "ground" | "creatures" | "overlay" | "debug";

export class WorldPerfSampler {
	private intervalMs: number;
	private lastFlush = performance.now();

	private frames = 0;

	private sum: Record<Key, number> = {
		world: 0,
		ground: 0,
		creatures: 0,
		overlay: 0,
		debug: 0,
	};

	private max: Record<Key, number> = {
		world: 0,
		ground: 0,
		creatures: 0,
		overlay: 0,
		debug: 0,
	};

	constructor(intervalMs = 250) {
		this.intervalMs = intervalMs;
	}

	begin(): number {
		return performance.now();
	}

	end(key: Key, start: number) {
		const dt = performance.now() - start;
		this.sum[key] += dt;
		if (dt > this.max[key]) this.max[key] = dt;
	}

	frame() {
		this.frames += 1;
	}

	flushIfDue(extraCounts?: Record<string, any>) {
		const enabled = usePerfStore.getState().enabled;
		if (!enabled) return;

		const now = performance.now();
		if (now - this.lastFlush < this.intervalMs) return;

		const div = Math.max(1, this.frames);

		usePerfStore.getState().setWorld({
			worldAvgMs: this.sum.world / div,
			worldMaxMs: this.max.world,

			groundAvgMs: this.sum.ground / div,
			groundMaxMs: this.max.ground,

			creaturesAvgMs: this.sum.creatures / div,
			creaturesMaxMs: this.max.creatures,

			overlayAvgMs: this.sum.overlay / div,
			overlayMaxMs: this.max.overlay,

			debugAvgMs: this.sum.debug / div,
			debugMaxMs: this.max.debug,
		});

		if (extraCounts) {
			usePerfStore.getState().setCounts(extraCounts as any);
		}

		// reset
		this.frames = 0;
		this.sum.world =
			this.sum.ground =
			this.sum.creatures =
			this.sum.overlay =
			this.sum.debug =
				0;
		this.max.world =
			this.max.ground =
			this.max.creatures =
			this.max.overlay =
			this.max.debug =
				0;

		this.lastFlush = now;
	}
}
