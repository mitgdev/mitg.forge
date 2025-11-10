import { base } from "@/infra/rpc/base";

export const servicesRoute = base
	.route({
		method: "POST",
		path: "/services",
		tags: ["Client"],
		summary: "Get client services",
		description: "Endpoint to retrieve client services",
	})
	.handler(async () => {
		// const ct = file.type || "text/plain;charset=utf-8";
		// const m = /charset=([^;]+)/i.exec(ct);
		// const encoding = m?.[1]?.toLowerCase() || "utf-8";

		// const ab = await file.arrayBuffer();
		// const text = new TextDecoder(encoding).decode(ab);
		return true;
	});
