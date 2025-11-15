import z from "zod";
import { publicProcedure } from "@/presentation/procedures/public";

export const pingRoute = publicProcedure
	.route({
		method: "GET",
		path: "/ping",
		tags: ["Utils"],
		summary: "Ping endpoint",
		description: "A simple endpoint to check if the server is running",
	})
	.output(z.object({ status: z.literal("pong") }))
	.handler(() => {
		return { status: "pong" };
	});
