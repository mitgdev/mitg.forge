import { randomBytes, randomInt } from "node:crypto";
import { injectable } from "tsyringe";

@injectable()
export class RandomCode {
	// (email or sms) verification codes are usually 6 digits long
	private readonly defaultNumericLength = 6;
	private readonly defaultTokenBytes = 32; // 256 bits = 32 bytes

	generateNumeric(length = this.defaultNumericLength): string {
		let code = "";
		for (let i = 0; i < length; i++) {
			code += randomInt(0, 10).toString();
		}
		return code;
	}

	generateToken(
		bytes = this.defaultTokenBytes,
		encoding: BufferEncoding = "hex",
	): string {
		return randomBytes(bytes).toString(encoding);
	}
}
