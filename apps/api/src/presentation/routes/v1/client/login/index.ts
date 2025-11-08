import { ClientLoginContractSchema } from "@/application/usecases/tibia/login/contract";
import { base } from "@/infra/rpc/base";

export const loginRoute = base
	.route({
		method: "POST",
		path: "/login",
		tags: ["Client"],
		summary: "Client login",
		description: "Endpoint for client login",
	})
	.input(ClientLoginContractSchema.input)
	.output(ClientLoginContractSchema.output)
	.handler(async ({ input, context }) => {
		return context.usecases.tibia.login.execute(input);
	});
