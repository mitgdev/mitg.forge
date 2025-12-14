import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { PaymentMethodItem } from "@/components/Payments/PaymentMethod";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { InnerContainer } from "@/ui/Container/Inner";
import { FormField, FormItem, FormMessage } from "@/ui/Form";
import type { FormValues } from "..";

export const ShopDonateStepProviders = () => {
	const { data: providers = [] } = useQuery(
		api.query.miforge.shop.providers.queryOptions(),
	);

	const form = useFormContext<FormValues>();
	const step = form.watch("step");
	const paymentId = form.watch("providerId");

	if (step !== "providers") {
		return null;
	}

	return (
		<>
			<InnerContainer>
				<FormField
					control={form.control}
					name="providerId"
					render={({ field: { value, onChange } }) => {
						return (
							<FormItem className="flex flex-col gap-1 px-1 py-2 md:px-2">
								<div className="flex flex-row flex-wrap justify-center gap-2 md:justify-start">
									{providers.map((provider) => {
										return (
											<PaymentMethodItem
												key={provider.id}
												title={provider.name}
												speed="instant"
												method={provider.method}
												selected={value === provider.id}
												onClick={() => {
													form.clearErrors("providerId");
													onChange(
														value === provider.id ? undefined : provider.id,
													);
												}}
											/>
										);
									})}
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
								form.setError("providerId", {
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
