import { inject, injectable } from "tsyringe";
import type { PlayersService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import { mapWithConcurrency } from "@/shared/concurrency";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	PlayerOutfitsContractInput,
	PlayerOutfitsContractOutput,
} from "./contract";

@injectable()
export class PlayerOutfitsUseCase
	implements UseCase<PlayerOutfitsContractInput, PlayerOutfitsContractOutput>
{
	constructor(
		@inject(TOKENS.PlayersService)
		private readonly playersService: PlayersService,
	) {}

	async execute(
		input: PlayerOutfitsContractInput,
	): Promise<PlayerOutfitsContractOutput> {
		const outfits = await mapWithConcurrency(
			input.parameters,
			5,
			async (outfitInput) => {
				const data = await this.playersService.makeOutfit(outfitInput);

				return {
					input: outfitInput,
					frames: data.frames,
				};
			},
		);

		return {
			outfits,
		};
	}
}
