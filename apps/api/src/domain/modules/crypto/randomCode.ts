import { randomBytes, randomInt } from "node:crypto";
import { injectable } from "tsyringe";

@injectable()
export class RandomCode {
	private readonly length = 12;

	generate(length?: number, type: "NUMBER" | "HASH" = "NUMBER"): string {
		if (type === "HASH") {
			return randomBytes(length ?? this.length).toString("hex");
		}

		const codeLength = length ?? this.length;

		const min = 10 ** (codeLength - 1);
		const max = 10 ** codeLength - 1;

		const code = randomInt(min, max + 1);
		return code.toString();
	}
}
