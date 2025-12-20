import type { ShopOrderForm } from "@miforge/api/shared/schemas/ShopOrderForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, use, useState } from "react";
import { api } from "../lib/api/factory";
import { useSession } from "./session";

type Context = {
	orderForm: ShopOrderForm | null;
	invalidate: () => Promise<void>;
	loading: boolean;
	cart: {
		open: boolean;
		setOpen: (open: boolean) => void;
	};
};

const OrderFormContext = createContext<Context | null>(null);

export function OrderFormProvider({ children }: { children: React.ReactNode }) {
	const [cartOpen, setCartOpen] = useState(false);
	const queryClient = useQueryClient();
	const { session } = useSession();
	const { data: orderForm, isPending: orderFormLoading } = useQuery(
		api.query.miforge.shop.orderForm.getMostRecent.queryOptions({
			enabled: !!session,
		}),
	);

	return (
		<OrderFormContext.Provider
			value={{
				orderForm: orderForm ?? null,
				cart: {
					open: cartOpen,
					setOpen: setCartOpen,
				},
				loading: orderFormLoading,
				invalidate: async () => {
					await queryClient.invalidateQueries({
						queryKey: api.query.miforge.shop.orderForm.getMostRecent.queryKey(),
					});
				},
			}}
		>
			{children}
		</OrderFormContext.Provider>
	);
}

export const useOrderForm = () => {
	const context = use(OrderFormContext);

	if (!context) {
		throw new Error("useOrderForm must be used within OrderFormProvider");
	}

	return context;
};
