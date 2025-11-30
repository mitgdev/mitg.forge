import { inject, injectable } from "tsyringe";
import type { LostAccountService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	LostAccountFindByEmailOrCharacterNameContractInput,
	LostAccountFindByEmailOrCharacterNameContractOutput,
} from "./contract";

@injectable()
export class LostAccountFindByEmailOrCharacterNameUseCase
	implements
		UseCase<
			LostAccountFindByEmailOrCharacterNameContractInput,
			LostAccountFindByEmailOrCharacterNameContractOutput
		>
{
	constructor(
		@inject(TOKENS.LostAccountService)
		private readonly lostAccountService: LostAccountService,
	) {}

	async execute(
		input: LostAccountFindByEmailOrCharacterNameContractInput,
	): Promise<LostAccountFindByEmailOrCharacterNameContractOutput> {
		await this.lostAccountService.findByEmail(input.email);
	}
}
