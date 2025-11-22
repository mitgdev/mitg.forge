import { ConfigUpdateContractSchema } from "@/application/usecases/config/update/contract";
import { isPermissionedProcedure } from "@/presentation/procedures/isPermissioned";

export const configUpdateRouter = isPermissionedProcedure
	.meta({
		permission: {
			type: "ADMIN",
		},
	})
	.route({
		method: "POST",
		path: "/",
		summary: "Update Configuration",
		successStatus: 204,
		description:
			"Updates the current configuration information of the application. Only 'ADMIN' users are allowed to perform this action.",
	})
	.input(ConfigUpdateContractSchema.input)
	.output(ConfigUpdateContractSchema.output)
	.handler(async ({ context, input }) => {
		context.usecases.config.update.execute(input);
	});
