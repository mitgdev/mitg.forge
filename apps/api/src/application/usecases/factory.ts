import type { DependencyContainer } from "tsyringe";
import { TOKENS } from "@/infra/di/tokens";
import type { AccountCharactersBySessionUseCase } from "./account/characters";
import type { AccountDetailsBySessionUseCase } from "./account/details";
import type { AccountLoginUseCase } from "./account/login";
import type { AccountLogoutUseCase } from "./account/logout";
import type { AccountPermissionedUseCase } from "./account/permissioned";
import type { AccountRegistrationUseCase } from "./account/registration";
import type { AccountStoreHistoryUseCase } from "./account/storeHistory";
import type { SessionCanBeAuthenticatedUseCase } from "./session";
import type { SessionAuthenticatedUseCase } from "./session/authenticated";
import type { SessionInfoUseCase } from "./session/info";
import type { SessionNotAuthenticatedUseCase } from "./session/notAuthenticated";
import type { TibiaLoginUseCase } from "./tibia/login";
import type { WorldsListUseCase } from "./worlds/list";

export class UseCasesFactory {
	constructor(private readonly di: DependencyContainer) {}

	get lostAccount() {
		const findByEmailOrCharacterName = this.di.resolve(
			TOKENS.LostAccountFindByEmailOrCharacterNameUseCase,
		);
		const generatePasswordReset = this.di.resolve(
			TOKENS.LostAccountGeneratePasswordResetUseCase,
		);
		const validateConfirmationToken = this.di.resolve(
			TOKENS.LostAccountVerifyConfirmationTokenUseCase,
		);
		const resetPasswordWithToken = this.di.resolve(
			TOKENS.LostAccountResetPasswordWithTokenUseCase,
		);
		const resetPasswordWithRecoveryKey = this.di.resolve(
			TOKENS.LostAccountResetPasswordWithRecoveryKeyUseCase,
		);
		const resetTwoFactorWithRecoveryKey = this.di.resolve(
			TOKENS.LostAccountResetTwoFactorWithRecoveryKeyUseCase,
		);
		const changeEmailWithRecoveryKey = this.di.resolve(
			TOKENS.LostAccountChangeEmailWithRecoveryKeyUseCase,
		);

		return {
			findByEmailOrCharacterName,
			generatePasswordReset,
			validateConfirmationToken,
			resetPasswordWithToken,
			resetPasswordWithRecoveryKey,
			resetTwoFactorWithRecoveryKey,
			changeEmailWithRecoveryKey,
		} as const;
	}

	get account() {
		const create = this.di.resolve(TOKENS.AccountCreateUseCase);
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
		const deleteCharacter = this.di.resolve(
			TOKENS.AccountDeleteCharacterUseCase,
		);
		const cancelDeleteCharacter = this.di.resolve(
			TOKENS.AccountCancelDeleteCharacterUseCase,
		);
		const auditHistory = this.di.resolve(TOKENS.AccountAuditUseCase);
		const confirmEmail = this.di.resolve(TOKENS.AccountConfirmEmailUseCase);
		const changePasswordWithOld = this.di.resolve(
			TOKENS.AccountChangePasswordWithOldUseCase,
		);
		const generatePasswordReset = this.di.resolve(
			TOKENS.AccountGeneratePasswordResetUseCase,
		);
		const changePasswordWithToken = this.di.resolve(
			TOKENS.AccountChangePasswordWithTokenUseCase,
		);
		const changeEmailWithPassword = this.di.resolve(
			TOKENS.AccountChangeEmailWithPasswordUseCase,
		);
		const generateEmailChange = this.di.resolve(
			TOKENS.AccountGenerateEmailChangeUseCase,
		);
		const previewEmailChange = this.di.resolve(
			TOKENS.AccountPreviewEmailChangeUseCase,
		);
		const confirmEmailChange = this.di.resolve(
			TOKENS.AccountConfirmEmailChangeUseCase,
		);
		const twoFactorSetup = this.di.resolve(TOKENS.AccountTwoFactorSetupUseCase);
		const twoFactorConfirm = this.di.resolve(
			TOKENS.AccountTwoFactorConfirmUseCase,
		);
		const twoFactorDisable = this.di.resolve(
			TOKENS.AccountTwoFactorDisableUseCase,
		);

		const discordOauthLink = this.di.resolve(
			TOKENS.AccountDiscordOauthLinkUseCase,
		);

		const discordOauthConfirmLink = this.di.resolve(
			TOKENS.AccountDiscordOauthConfirmLinkUseCase,
		);

		const discordOauthUnlink = this.di.resolve(
			TOKENS.AccountDiscordOauthUnlinkUseCase,
		);

		return {
			create,
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
			deleteCharacter,
			cancelDeleteCharacter,
			auditHistory,
			confirmEmail,
			changePasswordWithOld,
			generatePasswordReset,
			changePasswordWithToken,
			changeEmailWithPassword,
			generateEmailChange,
			previewEmailChange,
			confirmEmailChange,
			twoFactorSetup,
			twoFactorConfirm,
			twoFactorDisable,
			discordOauthLink,
			discordOauthConfirmLink,
			discordOauthUnlink,
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
		const canBeAuthenticated =
			this.di.resolve<SessionCanBeAuthenticatedUseCase>(
				TOKENS.SessionCanBeAuthenticatedUseCase,
			);

		return {
			info,
			authenticated,
			notAuthenticated,
			canBeAuthenticated,
		} as const;
	}

	get players() {
		const outfit = this.di.resolve(TOKENS.PlayerOutfitUseCase);
		const outfits = this.di.resolve(TOKENS.PlayerOutfitsUseCase);

		return {
			outfit,
			outfits,
		} as const;
	}

	get config() {
		const info = this.di.resolve(TOKENS.ConfigInfoUseCase);
		const update = this.di.resolve(TOKENS.ConfigUpdateUseCase);

		return {
			info,
			update,
		} as const;
	}

	get shop() {
		const services = this.di.resolve(TOKENS.ShopServicesUseCase);
		const providers = this.di.resolve(TOKENS.ShopProvidersUserCase);
		const orderCreate = this.di.resolve(TOKENS.ShopCreateOrderUseCase);

		return {
			services,
			providers,
			orderCreate,
		} as const;
	}
}
