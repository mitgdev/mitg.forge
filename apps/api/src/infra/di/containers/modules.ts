import { container, Lifecycle } from "tsyringe";
import { Cookies } from "@/domain/modules/cookies";
import { HasherCrypto } from "@/domain/modules/crypto/hasher";
import { JwtCrypto } from "@/domain/modules/crypto/jwt";
import { RecoveryKey } from "@/domain/modules/crypto/recoveryKey";
import { DetectionChanges } from "@/domain/modules/detection/changes";
import { PlayerNameDetection } from "@/domain/modules/detection/playerName";
import { Metadata } from "@/domain/modules/metadata";
import { Pagination } from "@/domain/modules/pagination";
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
		TOKENS.Metadata,
		{ useClass: Metadata },
		{ lifecycle: Lifecycle.ResolutionScoped },
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
}
