import { inject, injectable } from "tsyringe";
import type { PlayersService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	PlayerOutfitContractInput,
	PlayerOutfitContractOutput,
} from "./contract";

@injectable()
export class PlayerOutfitUseCase
	implements UseCase<PlayerOutfitContractInput, PlayerOutfitContractOutput>
{
	constructor(
		@inject(TOKENS.PlayersService)
		private readonly playersService: PlayersService,
	) {}

	async execute(
		input: PlayerOutfitContractInput,
	): Promise<PlayerOutfitContractOutput> {
		const data = await this.playersService.makeOutfit(input);

		return data.frames;
	}
}
