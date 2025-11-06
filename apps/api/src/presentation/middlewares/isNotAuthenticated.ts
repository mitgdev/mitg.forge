import { base } from "@/infra/rpc/base";

export const isNotAuthenticatedMiddleware = base.middleware(
	async ({ context, next }) => {
		await context.usecases.session.notAuthenticated.execute();

		return next({
			context,
		});
	},
);
