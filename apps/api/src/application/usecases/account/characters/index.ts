import { inject, injectable } from "tsyringe";
import type { AccountsService, PlayersService } from "@/application/services";
import type { ExecutionContext } from "@/domain/context";
import type { Pagination } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import { mapWithConcurrency } from "@/shared/concurrency";
import type { UseCase } from "@/shared/interfaces/usecase";
import { parseWeaponProficiencies } from "@/shared/utils/game/proficiencies";
import type {
	AccountCharactersContractInput,
	AccountCharactersContractOutput,
} from "./contract";

@injectable()
export class AccountCharactersBySessionUseCase
	implements
		UseCase<AccountCharactersContractInput, AccountCharactersContractOutput>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
		@inject(TOKENS.PlayersService)
		private readonly playersService: PlayersService,
		@inject(TOKENS.ExecutionContext)
		private readonly executionContext: ExecutionContext,
		@inject(TOKENS.Pagination) private readonly pagination: Pagination,
	) {}

	async execute(
		input: AccountCharactersContractInput,
	): Promise<AccountCharactersContractOutput> {
		const session = this.executionContext.session();

		const { characters, total } = await this.accountsService.characters(
			session.email,
		);

		const results = (await mapWithConcurrency(characters, 5, async (char) => {
			const isOwner = char.guilds !== null && char.guilds.ownerid === char.id;
			let guild = char.guilds;

			if (!guild) {
				guild = char.guild_membership?.guilds || null;
			}

			const outfit = await this.playersService.getOutfitForPlayer(char);

			return {
				...char,
				online: char.online,
				depot_items: char.player_depotitems,
				outfits: char.player_outfits,
				rewards: char.player_rewards,
				frames: outfit,
				daily_reward_collected: char.isreward === 0,
				daily_reward_history: char.daily_reward_history,
				proficiencies: parseWeaponProficiencies(char.weapon_proficiencies),
				guild: guild
					? {
							...guild,
							owner: isOwner,
							rank: char.guild_membership?.guild_ranks ?? null,
						}
					: null,
			};
		})) satisfies AccountCharactersContractOutput["results"];

		return this.pagination.paginate(results, {
			page: input.page ?? 1,
			size: input.size ?? 10,
			total,
		});
	}
}
