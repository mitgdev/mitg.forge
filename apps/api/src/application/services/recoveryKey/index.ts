import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import { RecoveryKey, type TokenHasher } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class RecoveryKeyService {
	constructor(
		@inject(RecoveryKey) private readonly recoveryKey: RecoveryKey,
		@inject(TOKENS.TokenHasher) private readonly tokenHasher: TokenHasher,
	) {}

	@Catch()
	async generate(): Promise<{
		rawRecoveryKey: string;
		hashedRecoveryKey: string;
	}> {
		const recoveryKey = this.recoveryKey.generate();
		const normalizedKey = this.recoveryKey.normalize(recoveryKey);
		const hashedRecoveryKey = this.tokenHasher.hash(normalizedKey);

		return {
			rawRecoveryKey: recoveryKey,
			hashedRecoveryKey: hashedRecoveryKey,
		};
	}

	@Catch()
	normalize(key: string): string {
		return this.recoveryKey.normalize(key);
	}

	@Catch()
	async isValid(key: string, hash: string): Promise<boolean> {
		const normalizedKey = this.recoveryKey.normalize(key);

		return this.tokenHasher.verify(normalizedKey, hash);
	}
}
