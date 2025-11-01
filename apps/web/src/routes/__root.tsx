import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { RouterContext } from "@/router";
import { SessionProvider } from "@/sdk/contexts/session";
import { env } from "@/sdk/env";
import { api } from "@/sdk/lib/api/factory";

const ReactQueryDevtools = lazy(() =>
	import("@tanstack/react-query-devtools").then((mod) => ({
		default: mod.ReactQueryDevtools,
	})),
);

const TanStackRouterDevtools = lazy(() =>
	import("@tanstack/react-router-devtools").then((mod) => ({
		default: mod.TanStackRouterDevtools,
	})),
);

export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		meta: [
			{
				title: "My App",
			},
			{
				name: "description",
				content: "My App is a web application",
			},
		],
	}),
	loader: async ({ context }) => {
		await context.clients.query.ensureQueryData(
			api.query.miforge.session.info.queryOptions(),
		);
	},
	component: () => {
		return (
			<SessionProvider>
				<HeadContent />
				<Outlet />
				{env.VITE_SHOW_DEVTOOLS && (
					<Suspense fallback={null}>
						<TanStackRouterDevtools
							position="bottom-left"
							initialIsOpen={false}
						/>
						<ReactQueryDevtools position="bottom" initialIsOpen={false} />
					</Suspense>
				)}
			</SessionProvider>
		);
	},
});
