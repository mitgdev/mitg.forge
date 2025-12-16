import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useOrderForm } from "../contexts/orderform";
import { api } from "../lib/api/factory";
import { withORPCErrorHandling } from "../utils/orpc";

export function useOrderFormItem() {
	const {
		mutateAsync: addOrUpdateItemMutation,
		isPending: addOrUpdateItemLoading,
	} = useMutation(
		api.query.miforge.shop.orderForm.addOrUpdateItem.mutationOptions(),
	);

	const { invalidate } = useOrderForm();

	const addOrUpdateItem = useCallback(
		(data: { productId: string; quantity: number; mode?: "ADD" | "SET" }) => {
			withORPCErrorHandling(
				async () => {
					const mode = data.mode ?? "ADD";

					await addOrUpdateItemMutation({
						productId: data.productId,
						quantity: data.quantity,
						mode: mode,
					});
				},
				{
					onSuccess: () => {
						invalidate();
					},
				},
			);
		},
		[addOrUpdateItemMutation, invalidate],
	);

	return {
		addOrUpdateItem,
		loading: addOrUpdateItemLoading,
	};
}
