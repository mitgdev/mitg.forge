import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
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

	const { mutateAsync: removeItemMutation, isPending: removeItemLoading } =
		useMutation(api.query.miforge.shop.orderForm.removeItem.mutationOptions());

	const { invalidate } = useOrderForm();

	const addOrUpdateItem = useCallback(
		async (data: {
			productId: string;
			quantity: number;
			mode?: "ADD" | "SET";
			options?: {
				toast?: {
					successMessage?: string;
				};
			};
		}) => {
			withORPCErrorHandling(
				async () => {
					const mode = data.mode ?? "ADD";

					await addOrUpdateItemMutation({
						productId: data.productId,
						quantity: data.quantity,
						mode: mode,
					});

					let successMessage = "Item adicionado ao carrinho.";
					if (mode === "SET") {
						successMessage = "Item atualizado no carrinho.";
					}

					if (data.options?.toast?.successMessage) {
						successMessage = data.options.toast.successMessage;
					}

					toast.success(successMessage, {
						position: "bottom-left",
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

	const removeItem = useCallback(
		async (data: {
			productId: string;
			options?: {
				toast?: {
					successMessage?: string;
				};
			};
		}) => {
			withORPCErrorHandling(
				async () => {
					await removeItemMutation({
						itemId: data.productId,
					});

					let successMessage = "Item removido do carrinho.";

					if (data.options?.toast?.successMessage) {
						successMessage = data.options.toast.successMessage;
					}

					toast.success(successMessage, {
						position: "bottom-left",
					});
				},
				{
					onSuccess: () => {
						invalidate();
					},
				},
			);
		},
		[removeItemMutation, invalidate],
	);

	return {
		addOrUpdateItem,
		removeItem,
		addOrUpdateLoading: addOrUpdateItemLoading,
		removeLoading: removeItemLoading,
	};
}
