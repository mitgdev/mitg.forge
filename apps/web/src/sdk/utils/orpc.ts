import { ORPCError, type ORPCErrorCode } from "@orpc/client";
import { toast } from "sonner";

type HandleORPCErrorOptions = {
	// biome-ignore lint/suspicious/noExplicitAny: <only to handle generic ORPC errors />
	onORPCError?: (error: ORPCError<ORPCErrorCode, any>) => void | Promise<void>;
	onUnknownError?: (error: unknown) => void | Promise<void>;
};

export async function handleORPCError(
	error: unknown,
	options: HandleORPCErrorOptions = {},
) {
	const { onORPCError, onUnknownError } = options;

	if (error instanceof ORPCError) {
		toast.error(error.message || "An error occurred.");

		if (onORPCError) {
			await onORPCError(error);
		}

		return;
	}

	toast.error("An unexpected error occurred. Please try again.");

	if (onUnknownError) {
		await onUnknownError(error);
	}
}

type WithORPCErrorHandlingOptions<T> = HandleORPCErrorOptions & {
	onSuccess?: (result: T) => void | Promise<void>;
};

export async function withORPCErrorHandling<T>(
	fn: () => Promise<T>,
	options: WithORPCErrorHandlingOptions<T> = {},
): Promise<T | null> {
	const { onORPCError, onSuccess, onUnknownError } = options;

	try {
		const result = await fn();

		if (onSuccess) {
			await onSuccess(result);
		}

		return result;
	} catch (error) {
		await handleORPCError(error, { onORPCError, onUnknownError });
		return null;
	}
}
