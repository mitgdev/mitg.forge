import { inject, injectable } from "tsyringe";
import type { WorldsRepository } from "@/domain/repositories/worlds";
import { TOKENS } from "@/infra/di/tokens";
import { CatchDecorator } from "../decorators/Catch";

@injectable()
export class WorldsService {
	constructor(
		@inject(TOKENS.WorldsRepository)
		private readonly worldsRepository: WorldsRepository,
	) {}

	@CatchDecorator()
	async findAllWorlds() {
		return this.worldsRepository.findAll();
	}
}
