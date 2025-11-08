import { isAuthenticatedMiddleware } from "./isAuthenticated";

export const isPermissionedMiddleware = isAuthenticatedMiddleware.concat(
	async ({ context, next, procedure }) => {
		const permission = procedure?.["~orpc"]?.meta?.permission;

		await context.usecases.account.permissioned.execute({
			permission,
		});

		return next({
			context,
		});
	},
);
