import { base } from "@/infra/rpc/base";

export const isAuthenticatedMiddleware = base.middleware(
	async ({ context, next }) => {
		await context.usecases.session.authenticated.execute();

		return next({
			context,
		});
	},
);
