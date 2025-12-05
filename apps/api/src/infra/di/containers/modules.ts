import { container, Lifecycle } from "tsyringe";
import {
	Cache,
	CacheKeys,
	Cookies,
	DetectionChanges,
	EmailLinks,
	HasherCrypto,
	JwtCrypto,
	Pagination,
	PlayerNameDetection,
	RandomCode,
	RecoveryKey,
	TokenHasher,
	TwoFactorAuth,
} from "@/domain/modules";
import { TOKENS } from "../tokens";

export function registerModules() {
	container.register(
		TOKENS.HasherCrypto,
		{ useClass: HasherCrypto },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.JwtCrypto,
		{ useClass: JwtCrypto },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.RecoveryKey,
		{ useClass: RecoveryKey },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.DetectionChanges,
		{ useClass: DetectionChanges },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.PlayerNameDetection,
		{ useClass: PlayerNameDetection },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.Cookies,
		{ useClass: Cookies },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.Pagination,
		{ useClass: Pagination },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.Cache,
		{ useClass: Cache },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.CacheKeys,
		{ useClass: CacheKeys },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.RandomCode,
		{ useClass: RandomCode },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.EmailLinks,
		{ useClass: EmailLinks },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.TokenHasher,
		{ useClass: TokenHasher },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.TwoFactorAuth,
		{ useClass: TwoFactorAuth },
		{ lifecycle: Lifecycle.Singleton },
	);
}
