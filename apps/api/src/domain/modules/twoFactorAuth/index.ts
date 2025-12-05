import { authenticator } from "otplib";
import { HashAlgorithms } from "otplib/core";
import { injectable } from "tsyringe";
import { env } from "@/infra/env";

authenticator.options = {
	step: 30,
	digits: 6,
	algorithm: HashAlgorithms.SHA1,
	window: 1,
};

@injectable()
export class TwoFactorAuth {
	private readonly issuer = env.SERVER_NAME;

	newSecret(): string {
		return authenticator.generateSecret();
	}

	generateURI(data: { secret: string; identifier: string }): string {
		return authenticator.keyuri(data.identifier, this.issuer, data.secret);
	}

	verify(data: { token: string; secret: string }): boolean {
		const token = data.token.trim();

		return authenticator.verify({
			secret: data.secret,
			token: token,
		});
	}
}
