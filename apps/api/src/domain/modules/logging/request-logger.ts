import type { Logger, RootLogger } from "./logger";

export function makeRequestLogger(root: Logger, context: ReqContext): Logger {
	const base = {
		requestId: context.get("requestId"),
		session: context.get("session"),
	};

	return (root as RootLogger).with(base);
}
