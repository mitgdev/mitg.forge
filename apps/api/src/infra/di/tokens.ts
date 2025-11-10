import type { InjectionToken } from "tsyringe";
import type {
	AccountsService,
	SessionService,
	TibiaClientService,
} from "@/application/services";
import type { AccountCharactersBySessionUseCase } from "@/application/usecases/account/characters";
import type { AccountDetailsBySessionUseCase } from "@/application/usecases/account/details";
import type { AccountLoginUseCase } from "@/application/usecases/account/login";
import type { AccountLogoutUseCase } from "@/application/usecases/account/logout";
import type { AccountPermissionedUseCase } from "@/application/usecases/account/permissioned";
import type { AccountStoreHistoryUseCase } from "@/application/usecases/account/storeHistory";
import type { SessionAuthenticatedUseCase } from "@/application/usecases/session/authenticated";
import type { SessionInfoUseCase } from "@/application/usecases/session/info";
import type { SessionNotAuthenticatedUseCase } from "@/application/usecases/session/notAuthenticated";
import type { TibiaLoginUseCase } from "@/application/usecases/tibia/login";
import type { Prisma } from "@/domain/modules/clients";
import type { Mailer } from "@/domain/modules/clients/mailer";
import type { Cookies } from "@/domain/modules/cookies";
import type { HasherCrypto } from "@/domain/modules/crypto/hasher";
import type { JwtCrypto } from "@/domain/modules/crypto/jwt";
import type { Logger, RootLogger } from "@/domain/modules/logging/logger";
import type { Metadata } from "@/domain/modules/metadata";
import type { Pagination } from "@/domain/modules/pagination";
import type {
	AccountRepository,
	PlayersRepository,
	SessionRepository,
} from "@/domain/repositories";

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

	// Utils
	Metadata: token<Metadata>("Metadata"),
	Cookies: token<Cookies>("Cookies"),
	Pagination: token<Pagination>("Pagination"),

	// Crypto
	HasherCrypto: token<HasherCrypto>("HasherCrypto"),
	JwtCrypto: token<JwtCrypto>("JwtCrypto"),

	// Repositories
	AccountRepository: token<AccountRepository>("AccountRepository"),
	PlayersRepository: token<PlayersRepository>("PlayersRepository"),
	SessionRepository: token<SessionRepository>("SessionRepository"),

	// Services
	TibiaClientService: token<TibiaClientService>("TibiaClientService"),
	AccountsService: token<AccountsService>("AccountsService"),
	SessionService: token<SessionService>("SessionService"),

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

	SessionInfoUseCase: token<SessionInfoUseCase>("SessionInfoUseCase"),
	SessionAuthenticatedUseCase: token<SessionAuthenticatedUseCase>(
		"SessionAuthenticatedUseCase",
	),
	SessionNotAuthenticatedUseCase: token<SessionNotAuthenticatedUseCase>(
		"SessionNotAuthenticatedUseCase",
	),

	TibiaLoginUseCase: token<TibiaLoginUseCase>("TibiaLoginUseCase"),
} as const;
