import type { WorldType } from "generated/client";
import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/modules/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class WorldsRepository {
	constructor(@inject(TOKENS.Prisma) private readonly prisma: Prisma) {}

	async findByType(type: WorldType) {
		return this.prisma.worlds.findFirst({
			where: {
				type: type,
			},
		});
	}

	async findAll() {
		return this.prisma.worlds.findMany({
			orderBy: {
				created_at: "asc",
			},
		});
	}
}
