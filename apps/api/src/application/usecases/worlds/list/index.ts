import { inject, injectable } from "tsyringe";
import type { WorldsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	WorldsListContractInput,
	WorldsListContractOutput,
} from "./contract";

@injectable()
export class WorldsListUseCase
	implements UseCase<WorldsListContractInput, WorldsListContractOutput>
{
	constructor(
		@inject(TOKENS.WorldsService) private worldsService: WorldsService,
	) {}

	async execute(): Promise<WorldsListContractOutput> {
		const result = await this.worldsService.findAllWorlds();

		return result;
	}
}
