import type { WorldType } from "generated/client";
import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";
import { mapWithConcurrency } from "@/shared/concurrency";
import type { OtsServerRepository } from "../otsServer";

@injectable()
export class WorldsRepository {
	constructor(
		@inject(TOKENS.Prisma) private readonly prisma: Prisma,
		@inject(TOKENS.OtsServerRepository)
		private readonly otsServerRepository: OtsServerRepository,
	) {}

	async findById(id: number) {
		return this.prisma.worlds.findUnique({
			where: {
				id: id,
			},
		});
	}

	async findByType(type: WorldType) {
		return this.prisma.worlds.findFirst({
			where: {
				type: type,
			},
		});
	}

	async findAllWithStatus() {
		const worlds = await this.prisma.worlds.findMany({
			orderBy: {
				created_at: "asc",
			},
		});

		const statusForAllWorlds = await mapWithConcurrency(
			worlds,
			5,
			async (world) => {
				const status = await this.otsServerRepository.status(
					world.ip,
					world.port_status,
				);

				return {
					...world,
					status: status,
				};
			},
		);

		return statusForAllWorlds;
	}

	async findAll() {
		return this.prisma.worlds.findMany({
			orderBy: {
				created_at: "asc",
			},
		});
	}
}
