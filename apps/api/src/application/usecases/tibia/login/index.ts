import { inject, injectable } from "tsyringe";
import type { TibiaClientService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";

import type { UseCase } from "@/shared/interfaces/usecase";
import {
	type ClientLoginContractInput,
	type ClientLoginContractOutput,
	ClientLoginContractSchema,
} from "./contract";

@injectable()
export class TibiaLoginUseCase
	implements UseCase<ClientLoginContractInput, ClientLoginContractOutput>
{
	constructor(
		@inject(TOKENS.TibiaClientService)
		private readonly tibiaClientService: TibiaClientService,
	) {}

	async execute(
		input: ClientLoginContractInput,
	): Promise<ClientLoginContractOutput> {
		const result = await ClientLoginContractSchema.inside.safeParseAsync(input);

		if (!result.success) {
			return {
				errorCode: 3,
				errorMessage: "Something went wrong",
			};
		}

		const { data } = result;

		return this.tibiaClientService.login(data.email, data.password, data.token);
	}
}
