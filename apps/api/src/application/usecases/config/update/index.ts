import { inject, injectable } from "tsyringe";
import type { ConfigService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ConfigUpdateContractInput,
	ConfigUpdateContractOutput,
} from "./contract";

@injectable()
export class ConfigUpdateUseCase
	implements UseCase<ConfigUpdateContractInput, ConfigUpdateContractOutput>
{
	constructor(
		@inject(TOKENS.ConfigService) private readonly configService: ConfigService,
	) {}

	execute(
		input: ConfigUpdateContractInput,
	): Promise<ConfigUpdateContractOutput> {
		return this.configService.update(input);
	}
}
