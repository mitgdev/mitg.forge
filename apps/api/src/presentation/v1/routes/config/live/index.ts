import { TOKENS } from "@/infra/di/tokens";
import { publicProcedure } from "@/presentation/procedures/public";

export const configLiveRouter = publicProcedure
	.route({
		method: "POST",
		path: "/live",
		summary: "Subscribe to live configuration updates",
		description:
			"Establishes a server-sent events (SSE) connection to receive real-time configuration updates.",
	})
	.handler(async function* ({ signal, lastEventId, context }) {
		const live = context.di.resolve(TOKENS.ConfigLiveRepository);
		const logger = context.di.resolve(TOKENS.Logger);

		const iterator = live.subscribeToConfigUpdateEvents({
			signal,
			lastEventId,
		});

		for await (const event of iterator) {
			logger.info("Emitting config live event", { eventId: event.updatedAt });
			yield event;
		}
	});
