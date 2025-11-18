import { inflateSync } from "node:zlib";
import { base } from "@/infra/rpc/base";
import { FileToText } from "@/shared/utils/fileToText";

export const fpsTrackingRoute = base
	.route({
		method: "POST",
		path: "/fps_tracking",
		tags: ["Client"],
		summary: "Tracking FPS data",
		description: "Endpoint to track FPS data from the client",
	})
	.handler(async ({ input }) => {
		const text = await FileToText(input as File);

		const fpsData = JSON.parse(text);
		console.log("FPS Data:", fpsData);

		if (fpsData.config) {
			const buf = Buffer.from(fpsData.config, "base64");
			const jsonStr = inflateSync(buf).toString("utf8");
			const config = JSON.parse(jsonStr);

			console.log("FPS Config:", config);
		}
	});
