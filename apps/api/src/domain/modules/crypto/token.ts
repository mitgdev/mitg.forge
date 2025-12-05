import { createHmac, timingSafeEqual } from "node:crypto";
import { injectable } from "tsyringe";
import { env } from "@/infra/env";

@injectable()
export class TokenHasher {
	private readonly secret = env.HASHER_SECRET;

	hash(token: string): string {
		return createHmac("sha256", this.secret).update(token).digest("hex");
	}

	verify(token: string, hash: string): boolean {
		const computed = this.hash(token);

		const a = Buffer.from(computed, "hex");
		const b = Buffer.from(hash, "hex");

		if (a.length !== b.length) return false;

		// Use timingSafeEqual to prevent timing attacks
		return timingSafeEqual(a, b);
	}
}
