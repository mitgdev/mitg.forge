import { container, Lifecycle } from "tsyringe";
import {
	AccountCancelDeleteCharacterUseCase,
	AccountChangeEmailWithPasswordUseCase,
	AccountCharactersBySessionUseCase,
	AccountConfirmEmailChangeUseCase,
	AccountConfirmEmailUseCase,
	AccountCreateCharacterUseCase,
	AccountCreateUseCase,
	AccountDeleteCharacterUseCase,
	AccountDetailsBySessionUseCase,
	AccountEditCharacterUseCase,
	AccountFindCharacterUseCase,
	AccountGenerateEmailChangeUseCase,
	AccountGeneratePasswordResetUseCase,
	AccountLoginUseCase,
	AccountLogoutUseCase,
	AccountPermissionedUseCase,
	AccountPreviewEmailChangeUseCase,
	AccountRegistrationUseCase,
	AccountStoreHistoryUseCase,
	AccountTwoFactorConfirmUseCase,
	AccountTwoFactorDisableUseCase,
	AccountTwoFactorSetupUseCase,
	AuditAccountUseCase,
	ChangePasswordWithOldUseCase,
	ChangePasswordWithTokenUseCase,
	ConfigInfoUseCase,
	ConfigUpdateUseCase,
	LostAccountChangeEmailWithRecoveryKeyUseCase,
	LostAccountFindByEmailOrCharacterNameUseCase,
	LostAccountGeneratePasswordResetUseCase,
	LostAccountResetPasswordWithRecoveryKeyUseCase,
	LostAccountResetPasswordWithTokenUseCase,
	LostAccountResetTwoFactorWithRecoveryKeyUseCase,
	LostAccountVerifyConfirmationTokenUseCase,
	PlayerOutfitsUseCase,
	PlayerOutfitUseCase,
	SessionAuthenticatedUseCase,
	SessionCanBeAuthenticatedUseCase,
	SessionInfoUseCase,
	SessionNotAuthenticatedUseCase,
	TibiaLoginUseCase,
	WorldsListUseCase,
} from "@/application/usecases";
import { TOKENS } from "../tokens";

export function registerUseCases() {
	container.register(
		TOKENS.AccountLoginUseCase,
		{ useClass: AccountLoginUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountDetailsBySessionUseCase,
		{ useClass: AccountDetailsBySessionUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountLogoutUseCase,
		{ useClass: AccountLogoutUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountPermissionedUseCase,
		{ useClass: AccountPermissionedUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountCharactersBySessionUseCase,
		{ useClass: AccountCharactersBySessionUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountStoreHistoryUseCase,
		{ useClass: AccountStoreHistoryUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountCreateCharacterUseCase,
		{ useClass: AccountCreateCharacterUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountFindCharacterUseCase,
		{ useClass: AccountFindCharacterUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountEditCharacterUseCase,
		{ useClass: AccountEditCharacterUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountDeleteCharacterUseCase,
		{ useClass: AccountDeleteCharacterUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountCancelDeleteCharacterUseCase,
		{ useClass: AccountCancelDeleteCharacterUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountAuditUseCase,
		{ useClass: AuditAccountUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountCreateUseCase,
		{ useClass: AccountCreateUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountConfirmEmailUseCase,
		{ useClass: AccountConfirmEmailUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountChangePasswordWithOldUseCase,
		{ useClass: ChangePasswordWithOldUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountGeneratePasswordResetUseCase,
		{ useClass: AccountGeneratePasswordResetUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountChangePasswordWithTokenUseCase,
		{ useClass: ChangePasswordWithTokenUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountTwoFactorSetupUseCase,
		{ useClass: AccountTwoFactorSetupUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountTwoFactorConfirmUseCase,
		{ useClass: AccountTwoFactorConfirmUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountTwoFactorDisableUseCase,
		{ useClass: AccountTwoFactorDisableUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.SessionInfoUseCase,
		{ useClass: SessionInfoUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.SessionAuthenticatedUseCase,
		{ useClass: SessionAuthenticatedUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.SessionNotAuthenticatedUseCase,
		{ useClass: SessionNotAuthenticatedUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.SessionCanBeAuthenticatedUseCase,
		{
			useClass: SessionCanBeAuthenticatedUseCase,
		},
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.AccountRegistrationUseCase,
		{ useClass: AccountRegistrationUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountChangeEmailWithPasswordUseCase,
		{ useClass: AccountChangeEmailWithPasswordUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountGenerateEmailChangeUseCase,
		{ useClass: AccountGenerateEmailChangeUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountPreviewEmailChangeUseCase,
		{ useClass: AccountPreviewEmailChangeUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountConfirmEmailChangeUseCase,
		{ useClass: AccountConfirmEmailChangeUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.WorldsListUseCase,
		{ useClass: WorldsListUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.LostAccountFindByEmailOrCharacterNameUseCase,
		{ useClass: LostAccountFindByEmailOrCharacterNameUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.LostAccountGeneratePasswordResetUseCase,
		{ useClass: LostAccountGeneratePasswordResetUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.LostAccountVerifyConfirmationTokenUseCase,
		{ useClass: LostAccountVerifyConfirmationTokenUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.LostAccountResetPasswordWithTokenUseCase,
		{ useClass: LostAccountResetPasswordWithTokenUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.LostAccountResetPasswordWithRecoveryKeyUseCase,
		{ useClass: LostAccountResetPasswordWithRecoveryKeyUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.LostAccountResetTwoFactorWithRecoveryKeyUseCase,
		{ useClass: LostAccountResetTwoFactorWithRecoveryKeyUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.LostAccountChangeEmailWithRecoveryKeyUseCase,
		{ useClass: LostAccountChangeEmailWithRecoveryKeyUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.ConfigInfoUseCase,
		{ useClass: ConfigInfoUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.ConfigUpdateUseCase,
		{ useClass: ConfigUpdateUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.PlayerOutfitUseCase,
		{ useClass: PlayerOutfitUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.PlayerOutfitsUseCase,
		{ useClass: PlayerOutfitsUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.TibiaLoginUseCase,
		{ useClass: TibiaLoginUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
}
