import { inject, injectable } from "tsyringe";
import type { TibiaClientService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import {
	type ClientLoginInput,
	type ClientLoginOutput,
	ClientLoginSchema,
} from "@/presentation/routes/v1/client/login/schema";
import type { UseCase } from "@/shared/interfaces/usecase";

@injectable()
export class TibiaLoginUseCase
	implements UseCase<ClientLoginInput, ClientLoginOutput>
{
	constructor(
		@inject(TOKENS.TibiaClientService)
		private readonly tibiaClientService: TibiaClientService,
	) {}

	async execute(input: ClientLoginInput): Promise<ClientLoginOutput> {
		const result = await ClientLoginSchema.inside.safeParseAsync(input);

		if (!result.success) {
			return {
				errorCode: 3,
				errorMessage: "Something went wrong",
			};
		}

		const { data } = result;

		return this.tibiaClientService.login(data.email, data.password);
	}
}
