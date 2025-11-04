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
		const result = await ClientLoginSchema.inside.safeParseAsync(input);

		if (!result.success) {
			return {
				errorCode: 3,
				errorMessage: "Something went wrong",
			};
		}

		const { data } = result;

		return await context.services.tibiaClient.login(data.email, data.password);
	});
