import type { InjectionToken } from "tsyringe";
import type {
	AccountsService,
	SessionService,
	TibiaClientService,
} from "@/application/services";
import type {
	AccountDetailsUseCase,
	AccountLoginUseCase,
	AccountLogoutUseCase,
	SessionAuthenticatedUseCase,
	SessionInfoUseCase,
	SessionNotAuthenticatedUseCase,
	TibiaLoginUseCase,
} from "@/application/usecases";
import type { Prisma } from "@/domain/modules/clients";
import type { Cookies } from "@/domain/modules/cookies";
import type { HasherCrypto } from "@/domain/modules/crypto/hasher";
import type { JwtCrypto } from "@/domain/modules/crypto/jwt";
import type { Logger, RootLogger } from "@/domain/modules/logging/logger";
import type { Metadata } from "@/domain/modules/metadata";
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

	// Utils
	Metadata: token<Metadata>("Metadata"),
	Cookies: token<Cookies>("Cookies"),

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
	AccountDetailsUseCase: token<AccountDetailsUseCase>("AccountDetailsUseCase"),
	AccountLogoutUseCase: token<AccountLogoutUseCase>("AccountLogoutUseCase"),

	SessionInfoUseCase: token<SessionInfoUseCase>("SessionInfoUseCase"),
	SessionAuthenticatedUseCase: token<SessionAuthenticatedUseCase>(
		"SessionAuthenticatedUseCase",
	),
	SessionNotAuthenticatedUseCase: token<SessionNotAuthenticatedUseCase>(
		"SessionNotAuthenticatedUseCase",
	),

	TibiaLoginUseCase: token<TibiaLoginUseCase>("TibiaLoginUseCase"),
} as const;
