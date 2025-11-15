import type { RouterClient } from "@orpc/server";
import type { router } from "@/presentation/v1/routes";

export type AppRouter = typeof router;
export type AppRouterClient = RouterClient<AppRouter>;
