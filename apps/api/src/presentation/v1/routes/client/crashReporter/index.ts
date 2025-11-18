import { base } from "@/infra/rpc/base";
import { FileToText } from "@/shared/utils/fileToText";

export const crashReporterRoute = base
	.route({
		method: "POST",
		path: "/crash_reporter",
		tags: ["Client"],
		summary: "Crash Reporter",
		description: "Endpoint to track crash data from the client",
	})
	.handler(async ({ input }) => {
		const text = await FileToText(input as File);
		console.log("Crash Data:", text);
	});
