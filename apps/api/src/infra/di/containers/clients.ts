import { container, Lifecycle } from "tsyringe";
import { OtsServerClient } from "@/domain/clients";
import { TOKENS } from "../tokens";

export function registerClients() {
	container.register(
		TOKENS.OtsServerClient,
		{ useClass: OtsServerClient },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
}
