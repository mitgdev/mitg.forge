import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { WorldsRepository } from "@/domain/repositories/worlds";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class WorldsService {
	constructor(
		@inject(TOKENS.WorldsRepository)
		private readonly worldsRepository: WorldsRepository,
	) {}

	@Catch()
	async findAllWorlds() {
		return this.worldsRepository.findAll();
	}
}
