import { useFormContext } from "react-hook-form";
import { PaymentMethodItem } from "@/components/Payments/PaymentMethod";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { InnerContainer } from "@/ui/Container/Inner";
import { FormField, FormItem, FormMessage } from "@/ui/Form";
import type { FormValues } from "..";

export const PaymentMethods = [
	{
		id: "MERCADO_PAGO_PIX",
		title: "Pix",
		speed: "instant",
		method: "pix",
	},
] as const;

export const ShopDonateStepPayments = () => {
	const form = useFormContext<FormValues>();
	const step = form.watch("step");
	const paymentId = form.watch("paymentMethod");

	if (step !== "payments") {
		return null;
	}

	return (
		<>
			<InnerContainer>
				<FormField
					control={form.control}
					name="paymentMethod"
					render={({ field: { value, onChange } }) => {
						return (
							<FormItem className="flex flex-col gap-1 px-1 py-2 md:px-2">
								<div className="flex flex-row flex-wrap justify-center gap-2 md:justify-start">
									{PaymentMethods.map((method) => (
										<PaymentMethodItem
											key={method.method + method.speed}
											title={method.title}
											speed={method.speed}
											method={method.method}
											selected={value === method.id}
											onClick={() => {
												form.clearErrors("paymentMethod");
												onChange(value === method.id ? undefined : method.id);
											}}
										/>
									))}
								</div>
								<FormMessage className="text-red-500" />
							</FormItem>
						);
					}}
				/>
			</InnerContainer>

			<InnerContainer>
				<div className="flex flex-row flex-wrap items-end justify-end gap-2">
					<ButtonImage
						variant="info"
						type="button"
						onClick={() => {
							if (!paymentId) {
								form.setError("paymentMethod", {
									type: "required",
									message: "Please select a payment method.",
								});
								return;
							}

							form.setValue("step", "services");
						}}
					>
						Next
					</ButtonImage>
				</div>
			</InnerContainer>
		</>
	);
};
