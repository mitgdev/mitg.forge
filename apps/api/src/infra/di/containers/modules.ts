import { container, Lifecycle } from "tsyringe";
import {
	Cookies,
	DetectionChanges,
	HasherCrypto,
	JwtCrypto,
	Metadata,
	Pagination,
	PlayerNameDetection,
	RecoveryKey,
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
