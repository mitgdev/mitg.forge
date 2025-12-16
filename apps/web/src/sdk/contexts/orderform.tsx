import type { ShopOrderForm } from "@miforge/api/shared/schemas/ShopOrderForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, use } from "react";
import { api } from "../lib/api/factory";
import { useSession } from "./session";

type Context = {
	orderForm: ShopOrderForm | null;
	invalidate: () => Promise<void>;
};

const OrderformContext = createContext<Context | null>(null);

export function OrderformProvider({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();
	const { session } = useSession();
	const { data: orderForm } = useQuery(
		api.query.miforge.shop.orderForm.queryOptions({
			enabled: !!session,
		}),
	);

	return (
		<OrderformContext.Provider
			value={{
				orderForm: orderForm ?? null,
				invalidate: async () => {
					await queryClient.invalidateQueries({
						queryKey: api.query.miforge.shop.orderForm.queryKey(),
					});
				},
			}}
		>
			{children}
		</OrderformContext.Provider>
	);
}

export const useOrderform = () => {
	const context = use(OrderformContext);

	if (!context) {
		throw new Error("useOrderform must be used within OrderformProvider");
	}

	return context;
};
