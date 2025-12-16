import type { Interaction } from "discord.js";
import type { InjectionToken } from "tsyringe";
import type {
	AccountConfirmationsService,
	AccountOauthService,
	AccountsService,
	AccountTwoFactorService,
	AuditService,
	ConfigService,
	LostAccountService,
	PlayersService,
	RecoveryKeyService,
	SessionService,
	ShopOrderService,
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
	AccountDiscordOauthConfirmLinkUseCase,
	AccountDiscordOauthLinkUseCase,
	AccountDiscordOauthUnlinkUseCase,
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
	ShopOrderFormAddOrUpdateItemUseCase,
	ShopOrderFormUseCase,
	TibiaLoginUseCase,
	WorldsListUseCase,
} from "@/application/usecases";
import type {
	DiscordAccountCommands,
	DiscordAccountShowButtonHandler,
	DiscordBot,
	DiscordButtonsOrchestrator,
	DiscordCommandsOrchestrator,
	DiscordPingCommand,
} from "@/discord";
import type {
	DiscordLinkedWithPermissionMiddleware,
	DiscordRequireLinkedAccountMiddleware,
	DiscordSessionMiddleware,
} from "@/discord/middlewares";
import type {
	DiscordApiClient,
	DiscordClient,
	HttpClient,
	Mailer,
	OtsServerClient,
	Prisma,
	Redis,
} from "@/domain/clients";
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
	AccountOauthRepository,
	AccountRegistrationRepository,
	AccountRepository,
	AuditRepository,
	ConfigLiveRepository,
	ConfigRepository,
	OtsServerRepository,
	PlayersRepository,
	SessionRepository,
	ShopOrderItemRepository,
	ShopOrderRepository,
	ShopPaymentOptionRepository,
	ShopProductRepository,
} from "@/domain/repositories";
import type { WorldsRepository } from "@/domain/repositories/worlds";
import type { EmailQueue } from "@/jobs/queue/email";
import type { EmailWorker } from "@/jobs/workers/email";

export const token = <T>(desc: string) => Symbol(desc) as InjectionToken<T>;

const DISCORD_TOKENS = {
	DiscordInteraction: token<Interaction>("DiscordInteraction"),
	DiscordHttpClient: token<HttpClient>("DiscordHttpClient"),
	DiscordApiClient: token<DiscordApiClient>("DiscordApiClient"),
	DiscordClient: token<DiscordClient>("DiscordClient"),
	DiscordBot: token<DiscordBot>("DiscordBot"),

	DiscordRequireLinkedAccountMiddleware:
		token<DiscordRequireLinkedAccountMiddleware>(
			"DiscordRequireLinkedAccountMiddleware",
		),
	DiscordLinkedWithPermissionMiddleware:
		token<DiscordLinkedWithPermissionMiddleware>(
			"DiscordLinkedWithPermissionMiddleware",
		),
	DiscordSessionMiddleware: token<DiscordSessionMiddleware>(
		"DiscordSessionMiddleware",
	),

	DiscordCommandsOrchestrator: token<DiscordCommandsOrchestrator>(
		"DiscordCommandsOrchestrator",
	),
	DiscordButtonsOrchestrator: token<DiscordButtonsOrchestrator>(
		"DiscordButtonsOrchestrator",
	),
	DiscordPingCommand: token<DiscordPingCommand>("DiscordPingCommand"),
	DiscordAccountCommands: token<DiscordAccountCommands>(
		"DiscordAccountCommands",
	),

	DiscordAccountShowButtonHandler: token<DiscordAccountShowButtonHandler>(
		"DiscordAccountShowButtonHandler",
	),
};

const REPOSITORIES_TOKENS = {
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
	AccountOauthRepository: token<AccountOauthRepository>(
		"AccountOauthRepository",
	),
	ShopOrderRepository: token<ShopOrderRepository>("ShopOrderRepository"),
	ShopPaymentOptionRepository: token<ShopPaymentOptionRepository>(
		"ShopPaymentOptionRepository",
	),
	ShopProductRepository: token<ShopProductRepository>("ShopProductRepository"),
	ShopOrderItemRepository: token<ShopOrderItemRepository>(
		"ShopOrderItemRepository",
	),
};

const UTILS_TOKENS = {
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
};

const USECASES_TOKENS = {
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
	AccountDiscordOauthLinkUseCase: token<AccountDiscordOauthLinkUseCase>(
		"AccountDiscordOauthLinkUseCase",
	),
	AccountDiscordOauthConfirmLinkUseCase:
		token<AccountDiscordOauthConfirmLinkUseCase>(
			"AccountDiscordOauthConfirmLinkUseCase",
		),
	AccountDiscordOauthUnlinkUseCase: token<AccountDiscordOauthUnlinkUseCase>(
		"AccountDiscordOauthUnlinkUseCase",
	),
	PlayerOutfitUseCase: token<PlayerOutfitUseCase>("PlayerOutfitUseCase"),
	PlayerOutfitsUseCase: token<PlayerOutfitsUseCase>("PlayerOutfitsUseCase"),
	TibiaLoginUseCase: token<TibiaLoginUseCase>("TibiaLoginUseCase"),
	ShopOrderFormUseCase: token<ShopOrderFormUseCase>("ShopOrderFormUseCase"),
	ShopOrderFormAddOrUpdateItemUseCase:
		token<ShopOrderFormAddOrUpdateItemUseCase>(
			"ShopOrderFormAddOrUpdateItemUseCase",
		),
};

const SERVICES_TOKENS = {
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
	AccountOauthService: token<AccountOauthService>("AccountOauthService"),
	ShopOrderService: token<ShopOrderService>("ShopOrderService"),
};

const QUEUE_AND_WORKERS_TOKENS = {
	EmailQueue: token<EmailQueue>("EmailQueue"),
	EmailWorker: token<EmailWorker>("EmailWorker"),
};

const CLIENTS_TOKENS = {
	Prisma: token<Prisma>("Prisma"),
	Mailer: token<Mailer>("Mailer"),
	Redis: token<Redis>("Redis"),
	BullConnection: token<Redis>("BullConnection"),
	EventCommander: token<Redis>("EventCommander"),
	EventSubscriber: token<Redis>("EventSubscriber"),
	AppLivePublisher: token<AppLivePublisher>("AppLivePublisher"),
	OtsServerClient: token<OtsServerClient>("OtsServerClient"),
	HttpClient: token<HttpClient>("HttpClient"),
};

export const TOKENS = {
	// context
	HttpContext: token<HttpContext>("HttpContext"),
	ExecutionContext: token<ExecutionContext>("ExecutionContext"),

	// Logger
	Logger: token<Logger>("Logger"),
	RootLogger: token<RootLogger>("RootLogger"),

	// Discord
	...DISCORD_TOKENS,

	// Clients
	...CLIENTS_TOKENS,

	// Queues && Workers
	...QUEUE_AND_WORKERS_TOKENS,

	// Utils
	...UTILS_TOKENS,

	// Repositories
	...REPOSITORIES_TOKENS,

	// Services
	...SERVICES_TOKENS,

	// UseCases
	...USECASES_TOKENS,
} as const;
