import { ChangePasswordWithOldContractSchema } from "@/application/usecases/account/changePasswordWithOld/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const changePasswordWithOldRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/change-with-old",
		summary: "Change Password With Old",
		successStatus: 204,
		description: "Change a user's password by providing the old password.",
	})
	.input(ChangePasswordWithOldContractSchema.input)
	.output(ChangePasswordWithOldContractSchema.output)
	.handler(async ({ context, input }) => {
		await context.usecases.account.changePasswordWithOld.execute({
			confirmPassword: input.confirmPassword,
			newPassword: input.newPassword,
			oldPassword: input.oldPassword,
		});
	});
