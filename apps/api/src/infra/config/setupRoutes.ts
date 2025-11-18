import { setupV1 } from "@/presentation/v1/setup";

export function setupRoutes(app: ExtendedHono) {
	setupV1(app);
}
