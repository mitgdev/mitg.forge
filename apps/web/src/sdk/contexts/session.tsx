import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { createContext, use } from "react";
import { api } from "@/sdk/lib/api/factory";

type Session = Awaited<ReturnType<typeof api.client.miforge.session.info>>;

type Context = {
	session: Session["session"] | null;
	refresh: () => void;
	logout: () => Promise<void>;
};

const SessionContext = createContext<Context | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const navigate = useNavigate();
	const qc = useQueryClient();

	const { mutateAsync } = useMutation(
		api.query.miforge.accounts.logout.mutationOptions({
			onSuccess: () => {
				qc.invalidateQueries({
					queryKey: api.query.miforge.session.info.queryKey(),
				});

				router.invalidate().finally(() => {
					navigate({
						to: "/",
						reloadDocument: true,
					});
				});
			},
		}),
	);

	const { data, refetch } = useQuery(
		api.query.miforge.session.info.queryOptions({
			initialData: {
				authenticated: false,
				session: null,
			},
		}),
	);

	return (
		<SessionContext.Provider
			value={{
				session: data.session ?? null,
				refresh: refetch,
				logout: async () => await mutateAsync(undefined),
			}}
		>
			{children}
		</SessionContext.Provider>
	);
}

export const useSession = () => {
	const context = use(SessionContext);

	if (!context) {
		throw new Error("useSession must be used within SessionProvider");
	}

	return context;
};
