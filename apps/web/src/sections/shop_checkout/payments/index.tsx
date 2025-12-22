import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { PaymentMethod } from "@/components/Payments/Method";
import { useOrderForm } from "@/sdk/contexts/orderform";
import { api } from "@/sdk/lib/api/factory";
import { withORPCErrorHandling } from "@/sdk/utils/orpc";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

export function ShopCheckoutPayments() {
	const { orderForm, invalidate: invalidateOrderForm } = useOrderForm();
	const { mutateAsync: setPaymentOption, isPending: settingPaymentOption } =
		useMutation(
			api.query.miforge.shop.orderForm.payments.setPayment.mutationOptions(),
		);

	const handleSelectPaymentOption = useCallback(
		async (paymentId: string) => {
			withORPCErrorHandling(
				async () => {
					await setPaymentOption({
						paymentOptionId: paymentId,
					});
				},
				{
					onSuccess: () => {
						invalidateOrderForm();
						toast.success("Payment method selected successfully");
					},
				},
			);
		},
		[invalidateOrderForm, setPaymentOption],
	);

	return (
		<Container title="Payments">
			<InnerContainer>
				{orderForm?.payment.providers.map((provider) => {
					const selected =
						orderForm.payment.selectedProvider?.id === provider.id;

					return (
						<PaymentMethod
							disabled={!provider.enabled || settingPaymentOption}
							title={provider.label}
							key={provider.id}
							selected={selected}
							method={provider.method}
							speed="instant"
							onClick={() => {
								if (selected) {
									toast.info("This payment method is already selected");
									return;
								}

								handleSelectPaymentOption(provider.id);
							}}
						/>
					);
				})}
			</InnerContainer>
		</Container>
	);
}
