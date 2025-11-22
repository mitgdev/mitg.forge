import {
	keepPreviousData,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { createContext, use, useEffect } from "react";
import { api } from "@/sdk/lib/api/factory";
import type { MiforgeConfig } from "@/sdk/types/config";

type Context = {
	config: MiforgeConfig;
};

const ConfigContext = createContext<Context | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();
	const query = useQuery(
		api.query.miforge.config.live.experimental_liveOptions({
			retry: true, // Infinite retry for more reliable streaming
			...(import.meta.env.DEV
				? {
						staleTime: 0, // Always fresh data in dev
						refetchOnMount: "always",
						refetchOnReconnect: "always",
					}
				: {
						staleTime: Number.POSITIVE_INFINITY, // nunca “fica stale”
						refetchOnMount: false, // não refaz a live à toa
						refetchOnWindowFocus: false, // não refaz ao focar aba
						refetchOnReconnect: false, // não duplica lógica de reconnect
					}),
		}),
	);

	const { data: config } = useQuery(
		api.query.miforge.config.info.queryOptions({
			placeholderData: keepPreviousData,
		}),
	);

	useEffect(() => {
		if (!query.data) return;

		queryClient.invalidateQueries({
			queryKey: api.query.miforge.config.info.queryKey(),
		});
	}, [query.data, queryClient]);

	return (
		// biome-ignore lint/style/noNonNullAssertion: <always available, preloaded by tanstack query>
		<ConfigContext.Provider value={{ config: config! }}>
			{children}
		</ConfigContext.Provider>
	);
}

export const useConfig = () => {
	const context = use(ConfigContext);

	if (!context) {
		throw new Error("useConfig must be used within a ConfigProvider");
	}

	return context;
};
