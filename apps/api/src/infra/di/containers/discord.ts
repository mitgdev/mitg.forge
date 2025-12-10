import { container, Lifecycle } from "tsyringe";
import {
	DiscordAccountCommands,
	DiscordAccountShowButtonHandler,
	DiscordBot,
	DiscordButtonsOrchestrator,
	DiscordCommandsOrchestrator,
	DiscordPingCommand,
} from "@/discord";
import {
	DiscordLinkedWithPermissionMiddleware,
	DiscordRequireLinkedAccountMiddleware,
	DiscordSessionMiddleware,
} from "@/discord/middlewares";
import { DiscordClient } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";

export const registerDiscord = () => {
	container.register(
		TOKENS.DiscordClient,
		{ useClass: DiscordClient },
		{ lifecycle: Lifecycle.Singleton },
	);

	container.register(
		TOKENS.DiscordBot,
		{ useClass: DiscordBot },
		{ lifecycle: env.isDev ? Lifecycle.ResolutionScoped : Lifecycle.Singleton },
	);

	container.register(
		TOKENS.DiscordRequireLinkedAccountMiddleware,
		{ useClass: DiscordRequireLinkedAccountMiddleware },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.DiscordLinkedWithPermissionMiddleware,
		{ useClass: DiscordLinkedWithPermissionMiddleware },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.DiscordSessionMiddleware,
		{ useClass: DiscordSessionMiddleware },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.DiscordCommandsOrchestrator,
		{ useClass: DiscordCommandsOrchestrator },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.DiscordButtonsOrchestrator,
		{ useClass: DiscordButtonsOrchestrator },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.DiscordPingCommand,
		{ useClass: DiscordPingCommand },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.DiscordAccountCommands,
		{ useClass: DiscordAccountCommands },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.DiscordAccountShowButtonHandler,
		{ useClass: DiscordAccountShowButtonHandler },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
};
