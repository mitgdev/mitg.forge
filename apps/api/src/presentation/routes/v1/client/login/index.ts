import { base } from "@/infra/rpc/base";
import { ClientLoginSchema } from "./schema";

export const loginRoute = base
	.route({
		method: "POST",
		path: "/login",
		tags: ["Client"],
		summary: "Client login",
		description: "Endpoint for client login",
	})
	.input(ClientLoginSchema.input)
	.output(ClientLoginSchema.output)
	.handler(async ({ input, context }) => {
		return context.usecases.tibia.login.execute(input);
	});
