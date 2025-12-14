import { container, Lifecycle } from "tsyringe";
import {
	DiscordApiClient,
	HttpClient,
	MercadoPagoClient,
	OtsServerClient,
} from "@/domain/clients";
import { env } from "@/infra/env";
import { TOKENS } from "../tokens";

export function registerClients() {
	container.register(
		TOKENS.OtsServerClient,
		{ useClass: OtsServerClient },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.HttpClient,
		{ useClass: HttpClient },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(TOKENS.DiscordHttpClient, {
		useFactory: (c) => {
			const logger = c.resolve(TOKENS.Logger);
			return new HttpClient(logger, {
				baseURL: env.DISCORD_API_URL,
			});
		},
	});

	container.register(TOKENS.MercadoPagoHttpClient, {
		useFactory: (c) => {
			const logger = c.resolve(TOKENS.Logger);
			return new HttpClient(logger, {
				baseURL: env.MERCADO_PAGO_BASE_URL,
				headers: {
					Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
				},
			});
		},
	});

	container.register(
		TOKENS.MercadoPagoClient,
		{ useClass: MercadoPagoClient },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.DiscordApiClient,
		{ useClass: DiscordApiClient },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
}
