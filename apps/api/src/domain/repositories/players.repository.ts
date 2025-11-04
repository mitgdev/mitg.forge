import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/modules/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class PlayersRepository {
	constructor(@inject(TOKENS.Prisma) private readonly prisma: Prisma) {}

	async byAccountId(accountId: number) {
		return this.prisma.players.findMany({
			where: {
				account_id: accountId,
			},
			orderBy: {
				name: "asc",
			},
		});
	}
}
