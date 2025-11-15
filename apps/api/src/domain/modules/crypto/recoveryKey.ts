import { randomBytes } from "node:crypto";
import { injectable } from "tsyringe";

@injectable()
export class RecoveryKey {
	private readonly charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	private readonly groups = 4;
	private readonly size = 5;

	generate(): string {
		const totalChars = this.groups * this.size;
		const bytes = randomBytes(totalChars);
		const chars: string[] = [];

		for (let i = 0; i < totalChars; i++) {
			const index = bytes[i] % this.charset.length;
			chars.push(this.charset[index]);
		}

		const raw = chars.join("");
		const withHyphens =
			raw.match(new RegExp(`.{1,${this.size}}`, "g"))?.join("-") || raw;

		return withHyphens;
	}
}
