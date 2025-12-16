import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Layout } from "@/layout";
import type { RouterContext } from "@/router";
import { ConfigProvider } from "@/sdk/contexts/config";
import { OrderformProvider } from "@/sdk/contexts/orderform";
import { SessionProvider } from "@/sdk/contexts/session";
import { env } from "@/sdk/env";
import { api } from "@/sdk/lib/api/factory";
import { NotFoundSection } from "@/sections/not_found";

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
	notFoundComponent: () => (
		<Layout>
			<NotFoundSection />
		</Layout>
	),
	head: () => ({
		meta: [
			{
				title: "MiForge",
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

		await context.clients.query.ensureQueryData(
			api.query.miforge.config.info.queryOptions(),
		);
	},
	component: () => {
		return (
			<ConfigProvider>
				<SessionProvider>
					<OrderformProvider>
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
					</OrderformProvider>
				</SessionProvider>
			</ConfigProvider>
		);
	},
});
