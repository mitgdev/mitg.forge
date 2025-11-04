import { base } from "@/infra/rpc/base";

export const isNotAuthenticatedMiddleware = base.middleware(
	async ({ context, next }) => {
		await context.services.session.isNotAuthenticated();

		return next({
			context,
		});
	},
);
