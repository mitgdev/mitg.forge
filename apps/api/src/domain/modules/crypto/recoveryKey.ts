import { randomBytes } from "node:crypto";
import { injectable } from "tsyringe";

@injectable()
export class RecoveryKey {
	private readonly charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	private readonly groups = 4;
	private readonly size = 5;

	normalize(key: string): string {
		return key.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
	}

	generate(): string {
		const totalChars = this.groups * this.size;
		const chars: string[] = [];

		let generated = 0;
		while (generated < totalChars) {
			const byte = randomBytes(1)[0];
			const max = 256 - (256 % this.charset.length);
			if (byte < max) {
				const index = byte % this.charset.length;
				chars.push(this.charset[index]);
				generated++;
			}
		}

		const raw = chars.join("");
		const withHyphens =
			raw.match(new RegExp(`.{1,${this.size}}`, "g"))?.join("-") || raw;

		return withHyphens;
	}
}
