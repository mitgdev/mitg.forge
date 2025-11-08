import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import type { Metadata } from "@/domain/modules/metadata";
import type { Pagination } from "@/domain/modules/pagination";
import { TOKENS } from "@/infra/di/tokens";
import type {
	AccountCharactersInput,
	AccountCharactersOutput,
} from "@/presentation/routes/v1/accounts/characters/schema";
import type { UseCase } from "@/shared/interfaces/usecase";

@injectable()
export class AccountCharactersBySessionUseCase
	implements UseCase<AccountCharactersInput, AccountCharactersOutput>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
		@inject(TOKENS.Metadata) private readonly metadata: Metadata,
		@inject(TOKENS.Pagination) private readonly pagination: Pagination,
	) {}

	async execute(
		input: AccountCharactersInput,
	): Promise<AccountCharactersOutput> {
		const session = this.metadata.session();

		const { characters, total } = await this.accountsService.characters(
			session.email,
		);

		const data = characters.map((char) => {
			const isOwner = char.guilds !== null && char.guilds.ownerid === char.id;
			let guild = char.guilds;

			if (!guild) {
				guild = char.guild_membership?.guilds || null;
			}

			return {
				...char,
				depot_items: char.player_depotitems,
				outfits: char.player_outfits,
				rewards: char.player_rewards,
				guild: guild
					? {
							...guild,
							owner: isOwner,
							rank: char.guild_membership?.guild_ranks ?? null,
						}
					: null,
			};
		}) satisfies AccountCharactersOutput["results"];

		return this.pagination.paginate(data, {
			page: input.page ?? 1,
			size: input.size ?? 10,
			total,
		});
	}
}
