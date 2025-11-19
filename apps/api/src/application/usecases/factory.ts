import type { DependencyContainer } from "tsyringe";
import { TOKENS } from "@/infra/di/tokens";
import type { AccountCharactersBySessionUseCase } from "./account/characters";
import type { AccountDetailsBySessionUseCase } from "./account/details";
import type { AccountLoginUseCase } from "./account/login";
import type { AccountLogoutUseCase } from "./account/logout";
import type { AccountPermissionedUseCase } from "./account/permissioned";
import type { AccountRegistrationUseCase } from "./account/registration";
import type { AccountStoreHistoryUseCase } from "./account/storeHistory";
import type { SessionAuthenticatedUseCase } from "./session/authenticated";
import type { SessionInfoUseCase } from "./session/info";
import type { SessionNotAuthenticatedUseCase } from "./session/notAuthenticated";
import type { TibiaLoginUseCase } from "./tibia/login";
import type { WorldsListUseCase } from "./worlds/list";

export class UseCasesFactory {
	constructor(private readonly di: DependencyContainer) {}

	get account() {
		const login = this.di.resolve<AccountLoginUseCase>(
			TOKENS.AccountLoginUseCase,
		);
		const detailsBySession = this.di.resolve<AccountDetailsBySessionUseCase>(
			TOKENS.AccountDetailsBySessionUseCase,
		);
		const logout = this.di.resolve<AccountLogoutUseCase>(
			TOKENS.AccountLogoutUseCase,
		);
		const permissioned = this.di.resolve<AccountPermissionedUseCase>(
			TOKENS.AccountPermissionedUseCase,
		);
		const charactersBySession =
			this.di.resolve<AccountCharactersBySessionUseCase>(
				TOKENS.AccountCharactersBySessionUseCase,
			);
		const storeHistory = this.di.resolve<AccountStoreHistoryUseCase>(
			TOKENS.AccountStoreHistoryUseCase,
		);
		const registrationKey = this.di.resolve<AccountRegistrationUseCase>(
			TOKENS.AccountRegistrationUseCase,
		);
		const createCharacter = this.di.resolve(
			TOKENS.AccountCreateCharacterUseCase,
		);
		const findCharacterByName = this.di.resolve(
			TOKENS.AccountFindCharacterUseCase,
		);
		const editCharacter = this.di.resolve(TOKENS.AccountEditCharacterUseCase);

		return {
			login,
			logout,
			permissioned,
			detailsBySession,
			charactersBySession,
			storeHistory,
			registrationKey,
			createCharacter,
			findCharacterByName,
			editCharacter,
		} as const;
	}

	get tibia() {
		const login = this.di.resolve<TibiaLoginUseCase>(TOKENS.TibiaLoginUseCase);

		return {
			login,
		} as const;
	}

	get world() {
		const list = this.di.resolve<WorldsListUseCase>(TOKENS.WorldsListUseCase);

		return {
			list,
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
