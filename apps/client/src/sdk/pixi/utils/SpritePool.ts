import type { Sprite } from "pixi.js";

export class SpritePool {
	private free: Sprite[] = [];
	private used = new Map<string, Sprite>();

	constructor(
		private factory: () => Sprite,
		prewarm = 0,
	) {
		for (let i = 0; i < prewarm; i++) this.free.push(this.factory());
	}

	acquire(id: string) {
		const existing = this.used.get(id);
		if (existing) return existing;

		const s = this.free.pop() ?? this.factory();
		this.used.set(id, s);
		s.visible = true;
		return s;
	}

	releaseMissing(alive: Set<string>) {
		for (const [id, s] of this.used) {
			if (alive.has(id)) continue;
			this.used.delete(id);
			s.visible = false;
			this.free.push(s);
		}
	}

	destroy() {
		for (const s of this.free) s.destroy();
		for (const s of this.used.values()) s.destroy();
		this.free = [];
		this.used.clear();
	}
}
