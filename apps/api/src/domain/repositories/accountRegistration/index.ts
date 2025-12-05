import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class AccountRegistrationRepository {
	constructor(@inject(TOKENS.Prisma) private readonly prisma: Prisma) {}

	async findByAccountId(accountId: number) {
		return this.prisma.miforge_account_registration.findUnique({
			where: {
				accountId: accountId,
			},
		});
	}

	async findByRecoveryKey(recoveryKey: string) {
		return this.prisma.miforge_account_registration.findUnique({
			where: {
				recoveryKey: recoveryKey,
			},
		});
	}

	async upsertByAccountId(
		accountId: number,
		data: {
			city: string;
			country: string;
			firstName: string;
			number: string;
			recoveryKey?: string;
			lastName: string;
			street: string;
			postal: string;
			state: string;
			additional: string | null;
		},
	) {
		return this.prisma.miforge_account_registration.upsert({
			where: {
				accountId: accountId,
			},
			create: {
				accountId: accountId,
				...data,
			},
			update: {
				accountId: accountId,
				...data,
			},
		});
	}
}
