import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { Toaster } from "@/ui/Toaster";
import { getQueryClient } from "./sdk/lib/react-query";

export type RouterContext = {
	clients: {
		query: ReturnType<typeof getQueryClient>;
	};
};

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		defaultPreload: "intent",
		defaultStaleTime: 5000,
		scrollRestoration: true,
		context: {
			clients: {
				query: getQueryClient(),
			},
		},
		Wrap: ({ children }: { children: React.ReactNode }) => {
			return (
				<QueryClientProvider client={getQueryClient()}>
					{children}
					<Toaster />
				</QueryClientProvider>
			);
		},
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
