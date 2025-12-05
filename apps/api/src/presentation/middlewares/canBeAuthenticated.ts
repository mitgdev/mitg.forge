import { base } from "@/infra/rpc/base";

export const canBeAuthenticatedMiddleware = base.middleware(
	async ({ context, next }) => {
		await context.usecases.session.canBeAuthenticated.execute();

		return next({
			context,
		});
	},
);
