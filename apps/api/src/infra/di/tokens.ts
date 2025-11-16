import type { InjectionToken } from "tsyringe";
import type {
	AccountsService,
	PlayersService,
	SessionService,
	TibiaClientService,
} from "@/application/services";
import type { WorldsService } from "@/application/services/worlds.service";
import type { AccountCharactersBySessionUseCase } from "@/application/usecases/account/characters";
import type { AccountCreateCharacterUseCase } from "@/application/usecases/account/createCharacter";
import type { AccountDetailsBySessionUseCase } from "@/application/usecases/account/details";
import type { AccountLoginUseCase } from "@/application/usecases/account/login";
import type { AccountLogoutUseCase } from "@/application/usecases/account/logout";
import type { AccountPermissionedUseCase } from "@/application/usecases/account/permissioned";
import type { AccountRegistrationUseCase } from "@/application/usecases/account/registration";
import type { AccountStoreHistoryUseCase } from "@/application/usecases/account/storeHistory";
import type { SessionAuthenticatedUseCase } from "@/application/usecases/session/authenticated";
import type { SessionInfoUseCase } from "@/application/usecases/session/info";
import type { SessionNotAuthenticatedUseCase } from "@/application/usecases/session/notAuthenticated";
import type { TibiaLoginUseCase } from "@/application/usecases/tibia/login";
import type { WorldsListUseCase } from "@/application/usecases/worlds/list";
import type { Mailer, Prisma, Redis } from "@/domain/modules/clients";
import type { Cookies } from "@/domain/modules/cookies";
import type { HasherCrypto } from "@/domain/modules/crypto/hasher";
import type { JwtCrypto } from "@/domain/modules/crypto/jwt";
import type { RecoveryKey } from "@/domain/modules/crypto/recoveryKey";
import type { DetectionChanges } from "@/domain/modules/detection/changes";
import type { Logger, RootLogger } from "@/domain/modules/logging/logger";
import type { Metadata } from "@/domain/modules/metadata";
import type { Pagination } from "@/domain/modules/pagination";
import type {
	AccountRepository,
	PlayersRepository,
	SessionRepository,
} from "@/domain/repositories";
import type { AccountRegistrationRepository } from "@/domain/repositories/accountRegistration";
import type { WorldsRepository } from "@/domain/repositories/worlds";
import type { EmailQueue } from "@/jobs/queue/email.queue";
import type { EmailWorker } from "@/jobs/workers/email.worker";

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

	// Queues
	EmailQueue: token<EmailQueue>("EmailQueue"),

	// Workers
	EmailWorker: token<EmailWorker>("EmailWorker"),

	// Utils
	Metadata: token<Metadata>("Metadata"),
	Cookies: token<Cookies>("Cookies"),
	Pagination: token<Pagination>("Pagination"),
	DetectionChanges: token<DetectionChanges>("DetectionChanges"),

	// Crypto
	HasherCrypto: token<HasherCrypto>("HasherCrypto"),
	JwtCrypto: token<JwtCrypto>("JwtCrypto"),
	RecoveryKey: token<RecoveryKey>("RecoveryKey"),

	// Repositories
	AccountRepository: token<AccountRepository>("AccountRepository"),
	AccountRegistrationRepository: token<AccountRegistrationRepository>(
		"AccountRegistrationRepository",
	),
	PlayersRepository: token<PlayersRepository>("PlayersRepository"),
	SessionRepository: token<SessionRepository>("SessionRepository"),
	WorldsRepository: token<WorldsRepository>("WorldsRepository"),

	// Services
	TibiaClientService: token<TibiaClientService>("TibiaClientService"),
	AccountsService: token<AccountsService>("AccountsService"),
	SessionService: token<SessionService>("SessionService"),
	WorldsService: token<WorldsService>("WorldsService"),
	PlayersService: token<PlayersService>("PlayersService"),

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

	WorldsListUseCase: token<WorldsListUseCase>("WorldsListUseCase"),

	SessionInfoUseCase: token<SessionInfoUseCase>("SessionInfoUseCase"),
	SessionAuthenticatedUseCase: token<SessionAuthenticatedUseCase>(
		"SessionAuthenticatedUseCase",
	),
	SessionNotAuthenticatedUseCase: token<SessionNotAuthenticatedUseCase>(
		"SessionNotAuthenticatedUseCase",
	),

	TibiaLoginUseCase: token<TibiaLoginUseCase>("TibiaLoginUseCase"),
} as const;
