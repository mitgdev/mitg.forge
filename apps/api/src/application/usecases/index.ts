import type { DependencyContainer } from "tsyringe";
import { TOKENS } from "@/infra/di/tokens";
import type {
	AccountDetailsUseCase,
	AccountLoginUseCase,
	AccountLogoutUseCase,
} from "./account";
import type {
	SessionAuthenticatedUseCase,
	SessionInfoUseCase,
	SessionNotAuthenticatedUseCase,
} from "./session";
import type { TibiaLoginUseCase } from "./tibia";

export * from "./account";
export * from "./session";
export * from "./tibia";

export class UseCases {
	constructor(private readonly di: DependencyContainer) {}

	get account() {
		const login = this.di.resolve<AccountLoginUseCase>(
			TOKENS.AccountLoginUseCase,
		);
		const details = this.di.resolve<AccountDetailsUseCase>(
			TOKENS.AccountDetailsUseCase,
		);
		const logout = this.di.resolve<AccountLogoutUseCase>(
			TOKENS.AccountLogoutUseCase,
		);

		return {
			login,
			details,
			logout,
		} as const;
	}

	get tibia() {
		const login = this.di.resolve<TibiaLoginUseCase>(TOKENS.TibiaLoginUseCase);

		return {
			login,
		} as const;
	}

	get session() {
		const info = this.di.resolve<SessionInfoUseCase>(TOKENS.SessionInfoUseCase);
		const authenticated = this.di.resolve<SessionAuthenticatedUseCase>(
			TOKENS.SessionAuthenticatedUseCase,
		);
		const notAuthenticated = this.di.resolve<SessionNotAuthenticatedUseCase>(
			TOKENS.SessionNotAuthenticatedUseCase,
		);

		return {
			info,
			authenticated,
			notAuthenticated,
		} as const;
	}
}
