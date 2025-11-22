import { inject, injectable } from "tsyringe";
import type { ConfigService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ConfigInfoContractInput,
	ConfigInfoContractOutput,
} from "./contract";

@injectable()
export class ConfigInfoUseCase
	implements UseCase<ConfigInfoContractInput, ConfigInfoContractOutput>
{
	constructor(
		@inject(TOKENS.ConfigService) private readonly configService: ConfigService,
	) {}

	execute(): Promise<ConfigInfoContractOutput> {
		return this.configService.config();
	}
}
