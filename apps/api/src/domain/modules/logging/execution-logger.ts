import type { ExecutionContext } from "@/domain/context";
import type { Logger } from "./logger";

export function makeExecutionLogger(
	root: Logger,
	context: ExecutionContext,
): Logger {
	const buildBase = () => {
		const session = context.sessionOrNull();

		return {
			source: context.source(),
			requestId: context.requestId(),
			accountId: session?.id ?? null,
			accountType: session?.type ?? null,
			ipAddress: context.ip(),
			userAgent: context.userAgent(),
		};
	};

	return {
		info(message, meta) {
			return root.info(message, { ...buildBase(), ...meta });
		},
		error(message, meta) {
			return root.error(message, { ...buildBase(), ...meta });
		},
		warn(message, meta) {
			return root.warn(message, { ...buildBase(), ...meta });
		},
		debug(message, meta) {
			return root.debug(message, { ...buildBase(), ...meta });
		},
		with(base) {
			return makeExecutionLogger(root.with(base), context);
		},
	} satisfies Logger;
}
