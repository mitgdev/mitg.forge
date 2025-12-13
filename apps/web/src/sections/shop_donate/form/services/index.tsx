import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { CoinsPackageItem } from "@/components/Payments/CoinsPackage";
import { formatter } from "@/sdk/hooks/useMoney";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { InnerContainer } from "@/ui/Container/Inner";
import { FormField, FormItem, FormMessage } from "@/ui/Form";
import type { FormValues } from "..";

export const ShopDonateStepServices = () => {
	const { data: services = [] } = useQuery(
		api.query.miforge.shop.services.queryOptions(),
	);

	const form = useFormContext<FormValues>();
	const step = form.watch("step");
	const serviceId = form.watch("serviceId");

	// Defina a ordem de tamanhos
	const SIZE_ORDER = ["tiny", "small", "medium", "large", "xlarge"] as const;

	// Ordena por preço total e atribui tamanho em ordem, caindo em "mega"
	const servicesWithSize = services
		.map((service) => ({
			...service,
			totalPrice: service.unit_price * service.quantity,
		}))
		.sort((a, b) => a.totalPrice - b.totalPrice)
		.map((service, index) => {
			const autoSize = SIZE_ORDER[index] ?? "mega";
			return { ...service, autoSize };
		});

	if (step !== "services") {
		return null;
	}

	return (
		<>
			<InnerContainer>
				<FormField
					control={form.control}
					name="serviceId"
					render={({ field: { value, onChange } }) => {
						return (
							<FormItem className="flex flex-col gap-1 px-1 py-2 md:px-2">
								<div className="flex flex-row flex-wrap justify-center gap-2">
									{servicesWithSize.map((service) => {
										const id = service.slug;
										const price = service.unit_price * service.quantity;

										if (service.type === "COINS") {
											return (
												<CoinsPackageItem
													key={id}
													amount={service.quantity}
													size={service.autoSize}
													price={formatter(price)}
													selected={value === id}
													onClick={() => {
														form.clearErrors("serviceId");
														onChange(value === id ? undefined : id);
													}}
												/>
											);
										}

										return null;
									})}
								</div>
								<FormMessage className="text-red-500" />
							</FormItem>
						);
					}}
				/>
				<span className="flex max-w-lg text-secondary text-xs">
					* Please note that the prices may vary depending on the current
					exchange rate. Different prices may apply depending on your selected
					payment method.
				</span>
			</InnerContainer>
			<InnerContainer>
				<div className="flex flex-row flex-wrap items-end justify-end gap-2">
					<ButtonImage
						variant="info"
						type="button"
						onClick={() => {
							form.setValue("step", "payments");
						}}
					>
						Back
					</ButtonImage>
					<ButtonImage
						variant="info"
						type="button"
						onClick={() => {
							if (!serviceId) {
								form.setError("serviceId", {
									type: "required",
									message: "Please select a service.",
								});
								return;
							}

							form.setValue("step", "review");
						}}
					>
						Next
					</ButtonImage>
				</div>
			</InnerContainer>
		</>
	);
};
