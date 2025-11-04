import { base } from "@/infra/rpc/base";

export const isAuthenticatedMiddleware = base.middleware(
	async ({ context, next }) => {
		await context.services.session.isAuthenticated();

		return next({
			context,
		});
	},
);
