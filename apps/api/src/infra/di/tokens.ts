import type { InjectionToken } from "tsyringe";
import type {
	AccountConfirmationsService,
	AccountsService,
	AccountTwoFactorService,
	AuditService,
	ConfigService,
	LostAccountService,
	PlayersService,
	RecoveryKeyService,
	SessionService,
	TibiaClientService,
	WorldsService,
} from "@/application/services";
import type {
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
import type { Mailer, OtsServerClient, Prisma, Redis } from "@/domain/clients";
import type { AppLivePublisher } from "@/domain/clients/live/types";
import type { ExecutionContext } from "@/domain/context";
import type {
	Cache,
	CacheKeys,
	Cookies,
	DetectionChanges,
	EmailLinks,
	HasherCrypto,
	JwtCrypto,
	Logger,
	Pagination,
	PlayerNameDetection,
	RandomCode,
	RecoveryKey,
	RootLogger,
	TokenHasher,
	TwoFactorAuth,
} from "@/domain/modules";
import type { Outfit } from "@/domain/modules/outfit";
import type {
	AccountConfirmationsRepository,
	AccountRegistrationRepository,
	AccountRepository,
	AuditRepository,
	ConfigLiveRepository,
	ConfigRepository,
	OtsServerRepository,
	PlayersRepository,
	SessionRepository,
} from "@/domain/repositories";
import type { WorldsRepository } from "@/domain/repositories/worlds";
import type { EmailQueue } from "@/jobs/queue/email";
import type { EmailWorker } from "@/jobs/workers/email";

export const token = <T>(desc: string) => Symbol(desc) as InjectionToken<T>;

export const TOKENS = {
	// context
	HttpContext: token<HttpContext>("HttpContext"),
	ExecutionContext: token<ExecutionContext>("ExecutionContext"),

	// Logger
	Logger: token<Logger>("Logger"),
	RootLogger: token<RootLogger>("RootLogger"),

	// Clients
	Prisma: token<Prisma>("Prisma"),
	Mailer: token<Mailer>("Mailer"),
	Redis: token<Redis>("Redis"),
	BullConnection: token<Redis>("BullConnection"),
	EventCommander: token<Redis>("EventCommander"),
	EventSubscriber: token<Redis>("EventSubscriber"),
	AppLivePublisher: token<AppLivePublisher>("AppLivePublisher"),
	OtsServerClient: token<OtsServerClient>("OtsServerClient"),

	// Queues
	EmailQueue: token<EmailQueue>("EmailQueue"),

	// Workers
	EmailWorker: token<EmailWorker>("EmailWorker"),

	// Utils
	Cookies: token<Cookies>("Cookies"),
	Pagination: token<Pagination>("Pagination"),
	DetectionChanges: token<DetectionChanges>("DetectionChanges"),
	PlayerNameDetection: token<PlayerNameDetection>("PlayerNameDetection"),
	Cache: token<Cache>("Cache"),
	CacheKeys: token<CacheKeys>("CacheKeys"),
	RandomCode: token<RandomCode>("RandomCode"),
	EmailLinks: token<EmailLinks>("EmailLinks"),
	TokenHasher: token<TokenHasher>("TokenHasher"),
	TwoFactorAuth: token<TwoFactorAuth>("TwoFactorAuth"),
	Outfit: token<Outfit>("Outfit"),

	// Crypto
	HasherCrypto: token<HasherCrypto>("HasherCrypto"),
	JwtCrypto: token<JwtCrypto>("JwtCrypto"),
	RecoveryKey: token<RecoveryKey>("RecoveryKey"),

	// Repositories
	AccountRepository: token<AccountRepository>("AccountRepository"),
	AccountRegistrationRepository: token<AccountRegistrationRepository>(
		"AccountRegistrationRepository",
	),
	AccountConfirmationsRepository: token<AccountConfirmationsRepository>(
		"AccountConfirmationsRepository",
	),
	PlayersRepository: token<PlayersRepository>("PlayersRepository"),
	SessionRepository: token<SessionRepository>("SessionRepository"),
	WorldsRepository: token<WorldsRepository>("WorldsRepository"),
	AuditRepository: token<AuditRepository>("AuditRepository"),
	ConfigLiveRepository: token<ConfigLiveRepository>("ConfigLiveRepository"),
	ConfigRepository: token<ConfigRepository>("ConfigRepository"),
	OtsServerRepository: token<OtsServerRepository>("OtsServerRepository"),

	// Services
	TibiaClientService: token<TibiaClientService>("TibiaClientService"),
	AccountsService: token<AccountsService>("AccountsService"),
	AccountConfirmationsService: token<AccountConfirmationsService>(
		"AccountConfirmationsService",
	),
	AccountTwoFactorService: token<AccountTwoFactorService>(
		"AccountTwoFactorService",
	),
	SessionService: token<SessionService>("SessionService"),
	WorldsService: token<WorldsService>("WorldsService"),
	PlayersService: token<PlayersService>("PlayersService"),
	AuditService: token<AuditService>("AuditService"),
	ConfigService: token<ConfigService>("ConfigService"),
	LostAccountService: token<LostAccountService>("LostAccountService"),
	RecoveryKeyService: token<RecoveryKeyService>("RecoveryKeyService"),

	// UseCases
	AccountLoginUseCase: token<AccountLoginUseCase>("LoginUseCase"),
	AccountDetailsBySessionUseCase: token<AccountDetailsBySessionUseCase>(
		"AccountDetailsBySessionUseCase",
	),
	AccountLogoutUseCase: token<AccountLogoutUseCase>("AccountLogoutUseCase"),
	AccountPermissionedUseCase: token<AccountPermissionedUseCase>(
		"AccountPermissionedUseCase",
	),
	AccountCharactersBySessionUseCase: token<AccountCharactersBySessionUseCase>(
		"AccountCharactersBySessionUseCase",
	),
	AccountStoreHistoryUseCase: token<AccountStoreHistoryUseCase>(
		"AccountStoreHistoryUseCase",
	),
	AccountRegistrationUseCase: token<AccountRegistrationUseCase>(
		"AccountRegistrationUseCase",
	),
	AccountCreateCharacterUseCase: token<AccountCreateCharacterUseCase>(
		"AccountCreateCharacterUseCase",
	),
	AccountFindCharacterUseCase: token<AccountFindCharacterUseCase>(
		"AccountFindCharacterUseCase",
	),
	AccountEditCharacterUseCase: token<AccountEditCharacterUseCase>(
		"AccountEditCharacterUseCase",
	),
	AccountDeleteCharacterUseCase: token<AccountDeleteCharacterUseCase>(
		"AccountDeleteCharacterUseCase",
	),
	AccountCancelDeleteCharacterUseCase:
		token<AccountCancelDeleteCharacterUseCase>(
			"AccountCancelDeleteCharacterUseCase",
		),
	AccountAuditUseCase: token<AuditAccountUseCase>("AuditAccountUseCase"),
	AccountCreateUseCase: token<AccountCreateUseCase>("AccountCreateUseCase"),
	AccountConfirmEmailUseCase: token<AccountConfirmEmailUseCase>(
		"AccountConfirmEmailUseCase",
	),
	AccountChangePasswordWithOldUseCase: token<ChangePasswordWithOldUseCase>(
		"AccountChangePasswordWithOldUseCase",
	),
	AccountGeneratePasswordResetUseCase:
		token<AccountGeneratePasswordResetUseCase>(
			"AccountGeneratePasswordResetUseCase",
		),
	AccountChangePasswordWithTokenUseCase: token<ChangePasswordWithTokenUseCase>(
		"AccountChangePasswordWithTokenUseCase",
	),
	AccountChangeEmailWithPasswordUseCase:
		token<AccountChangeEmailWithPasswordUseCase>(
			"AccountChangeEmailWithPasswordUseCase",
		),
	AccountGenerateEmailChangeUseCase: token<AccountGenerateEmailChangeUseCase>(
		"AccountGenerateEmailChangeUseCase",
	),
	AccountPreviewEmailChangeUseCase: token<AccountPreviewEmailChangeUseCase>(
		"AccountPreviewEmailChangeUseCase",
	),
	AccountConfirmEmailChangeUseCase: token<AccountConfirmEmailChangeUseCase>(
		"AccountConfirmEmailChangeUseCase",
	),
	AccountTwoFactorSetupUseCase: token<AccountTwoFactorSetupUseCase>(
		"AccountTwoFactorSetupUseCase",
	),
	AccountTwoFactorConfirmUseCase: token<AccountTwoFactorConfirmUseCase>(
		"AccountTwoFactorConfirmUseCase",
	),
	AccountTwoFactorDisableUseCase: token<AccountTwoFactorDisableUseCase>(
		"AccountTwoFactorDisableUseCase",
	),

	LostAccountFindByEmailOrCharacterNameUseCase:
		token<LostAccountFindByEmailOrCharacterNameUseCase>(
			"LostAccountFindByEmailOrCharacterNameUseCase",
		),
	LostAccountGeneratePasswordResetUseCase:
		token<LostAccountGeneratePasswordResetUseCase>(
			"LostAccountGeneratePasswordResetUseCase",
		),
	LostAccountVerifyConfirmationTokenUseCase:
		token<LostAccountVerifyConfirmationTokenUseCase>(
			"LostAccountVerifyConfirmationTokenUseCase",
		),
	LostAccountResetPasswordWithTokenUseCase:
		token<LostAccountResetPasswordWithTokenUseCase>(
			"LostAccountResetPasswordWithTokenUseCase",
		),
	LostAccountResetPasswordWithRecoveryKeyUseCase:
		token<LostAccountResetPasswordWithRecoveryKeyUseCase>(
			"LostAccountResetPasswordWithRecoveryKeyUseCase",
		),
	LostAccountResetTwoFactorWithRecoveryKeyUseCase:
		token<LostAccountResetTwoFactorWithRecoveryKeyUseCase>(
			"LostAccountResetTwoFactorWithRecoveryKeyUseCase",
		),
	LostAccountChangeEmailWithRecoveryKeyUseCase:
		token<LostAccountChangeEmailWithRecoveryKeyUseCase>(
			"LostAccountChangeEmailWithRecoveryKeyUseCase",
		),

	WorldsListUseCase: token<WorldsListUseCase>("WorldsListUseCase"),

	ConfigInfoUseCase: token<ConfigInfoUseCase>("ConfigInfoUseCase"),
	ConfigUpdateUseCase: token<ConfigUpdateUseCase>("ConfigUpdateUseCase"),

	SessionInfoUseCase: token<SessionInfoUseCase>("SessionInfoUseCase"),
	SessionAuthenticatedUseCase: token<SessionAuthenticatedUseCase>(
		"SessionAuthenticatedUseCase",
	),
	SessionNotAuthenticatedUseCase: token<SessionNotAuthenticatedUseCase>(
		"SessionNotAuthenticatedUseCase",
	),
	SessionCanBeAuthenticatedUseCase: token<SessionCanBeAuthenticatedUseCase>(
		"SessionCanBeAuthenticatedUseCase",
	),

	PlayerOutfitUseCase: token<PlayerOutfitUseCase>("PlayerOutfitUseCase"),
	PlayerOutfitsUseCase: token<PlayerOutfitsUseCase>("PlayerOutfitsUseCase"),

	TibiaLoginUseCase: token<TibiaLoginUseCase>("TibiaLoginUseCase"),
} as const;
