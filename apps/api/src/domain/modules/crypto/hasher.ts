import crypto from "node:crypto";
import { injectable } from "tsyringe";

@injectable()
export class HasherCrypto {
	private readonly algorithm = "sha1";

	hash(value: string): string {
		return crypto.hash(this.algorithm, value);
	}

	compare(value: string, hash: string): boolean {
		return crypto.hash(this.algorithm, value) === hash;
	}
}
