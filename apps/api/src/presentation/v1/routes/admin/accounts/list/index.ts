import { ListAccountsContractSchema } from "@/application/usecases/account/listAccounts/contract";
import { isPermissionedProcedure } from "@/presentation/procedures/isPermissioned";

export const listAccountsRouter = isPermissionedProcedure
	.meta({
		permission: {
			type: "GAME_MASTER",
		},
	})
	.route({
		method: "GET",
		path: "/list",
		summary: "List Accounts",
		successStatus: 200,
		description:
			"Retrieves a list of accounts registered on the server. Only GAME_MASTER and ADMIN users are allowed to perform this action",
	})
	.input(ListAccountsContractSchema.input)
	.output(ListAccountsContractSchema.output)
	.handler(async ({ context, input }) => {
		return await context.usecases.account.listAccounts.execute(input);
	});
