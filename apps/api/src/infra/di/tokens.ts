import type { InjectionToken } from "tsyringe";
import type {
	AccountConfirmationsService,
	AccountsService,
	AuditService,
	ConfigService,
	PlayersService,
	SessionService,
	TibiaClientService,
	WorldsService,
} from "@/application/services";
import type {
	AccountCancelDeleteCharacterUseCase,
	AccountCharactersBySessionUseCase,
	AccountConfirmEmailUseCase,
	AccountCreateCharacterUseCase,
	AccountCreateUseCase,
	AccountDeleteCharacterUseCase,
	AccountDetailsBySessionUseCase,
	AccountEditCharacterUseCase,
	AccountFindCharacterUseCase,
	AccountGeneratePasswordResetUseCase,
	AccountLoginUseCase,
	AccountLogoutUseCase,
	AccountPermissionedUseCase,
	AccountRegistrationUseCase,
	AccountStoreHistoryUseCase,
	AuditAccountUseCase,
	ChangePasswordWithOldUseCase,
	ConfigInfoUseCase,
	ConfigUpdateUseCase,
	SessionAuthenticatedUseCase,
	SessionInfoUseCase,
	SessionNotAuthenticatedUseCase,
	TibiaLoginUseCase,
	WorldsListUseCase,
} from "@/application/usecases";
import type { Mailer, Prisma, Redis } from "@/domain/clients";
import type { AppLivePublisher } from "@/domain/clients/live/types";
import type {
	Cache,
	CacheKeys,
	Cookies,
	DetectionChanges,
	HasherCrypto,
	JwtCrypto,
	Logger,
	Metadata,
	Pagination,
	PlayerNameDetection,
	RandomCode,
	RecoveryKey,
	RootLogger,
} from "@/domain/modules";
import type {
	AccountConfirmationsRepository,
	AccountRepository,
	AuditRepository,
	ConfigLiveRepository,
	ConfigRepository,
	PlayersRepository,
	SessionRepository,
} from "@/domain/repositories";
import type { AccountRegistrationRepository } from "@/domain/repositories/account/registration";
import type { WorldsRepository } from "@/domain/repositories/worlds";
import type { EmailQueue } from "@/jobs/queue/email";
import type { EmailWorker } from "@/jobs/workers/email";

export const token = <T>(desc: string) => Symbol(desc) as InjectionToken<T>;

export const TOKENS = {
	// context
	Context: token<ReqContext>("Context"),

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

	// Queues
	EmailQueue: token<EmailQueue>("EmailQueue"),

	// Workers
	EmailWorker: token<EmailWorker>("EmailWorker"),

	// Utils
	Metadata: token<Metadata>("Metadata"),
	Cookies: token<Cookies>("Cookies"),
	Pagination: token<Pagination>("Pagination"),
	DetectionChanges: token<DetectionChanges>("DetectionChanges"),
	PlayerNameDetection: token<PlayerNameDetection>("PlayerNameDetection"),
	Cache: token<Cache>("Cache"),
	CacheKeys: token<CacheKeys>("CacheKeys"),
	RandomCode: token<RandomCode>("RandomCode"),

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

	// Services
	TibiaClientService: token<TibiaClientService>("TibiaClientService"),
	AccountsService: token<AccountsService>("AccountsService"),
	AccountConfirmationsService: token<AccountConfirmationsService>(
		"AccountConfirmationsService",
	),
	SessionService: token<SessionService>("SessionService"),
	WorldsService: token<WorldsService>("WorldsService"),
	PlayersService: token<PlayersService>("PlayersService"),
	AuditService: token<AuditService>("AuditService"),
	ConfigService: token<ConfigService>("ConfigService"),

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

	TibiaLoginUseCase: token<TibiaLoginUseCase>("TibiaLoginUseCase"),
} as const;
