import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { List } from "@/components/List";
import { useSession } from "@/sdk/contexts/session";
import { formatter } from "@/sdk/hooks/useMoney";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { Checkbox } from "@/ui/Checkbox";
import { InnerContainer } from "@/ui/Container/Inner";
import { FormControl, FormField, FormItem, FormMessage } from "@/ui/Form";
import { Label } from "@/ui/Label";
import type { FormValues } from "..";

export const ShopDonateStepReview = () => {
	const { data: providers = [] } = useQuery(
		api.query.miforge.shop.providers.queryOptions(),
	);

	const { data: services } = useQuery(
		api.query.miforge.shop.services.queryOptions(),
	);
	const { session } = useSession();
	const form = useFormContext<FormValues>();
	const step = form.watch("step");

	const providerId = form.watch("providerId");
	const serviceId = form.watch("serviceId");

	const selectedService = useMemo(() => {
		return services?.find((service) => service.id === serviceId);
	}, [serviceId, services]);

	const selectedProvider = useMemo(() => {
		return providers.find((provider) => provider.id === providerId);
	}, [providerId, providers]);

	if (step !== "review") {
		return null;
	}

	return (
		<>
			<InnerContainer className="p-0">
				<List zebra>
					<List.Item title="For">
						<span className="text-secondary">{session?.email}</span>
					</List.Item>
				</List>
			</InnerContainer>
			<InnerContainer className="p-0">
				<List zebra>
					<List.Item title="Payment Method">
						<span className="text-secondary">{selectedProvider?.name}</span>
					</List.Item>
					<List.Item title="Service Type">
						<span className="text-secondary">{selectedService?.type}</span>
					</List.Item>
					<List.Item title="Total Price">
						<span className="text-secondary">
							{formatter(
								(selectedService?.unit_price ?? 0) *
									(selectedService?.quantity ?? 0),
							)}
						</span>
					</List.Item>
					<List.Item title="Quantity">
						<span className="text-secondary">{selectedService?.quantity}</span>
					</List.Item>
				</List>
			</InnerContainer>
			<InnerContainer>
				<FormField
					control={form.control}
					name="consent"
					render={({ field: { value, onChange } }) => {
						return (
							<FormItem className="flex flex-col items-start gap-2">
								<FormControl>
									<Label
										htmlFor="terms"
										className="flex flex-row items-center gap-2"
									>
										<Checkbox
											checked={value || false}
											onCheckedChange={(checked) => onChange(checked)}
											id="terms"
										/>
										<div className="text-secondary text-sm leading-tight">
											I agree to the{" "}
											<Link
												to="/"
												className="font-bolder text-blue-800 hover:underline"
											>
												Service agreement
											</Link>{" "}
											, the{" "}
											<Link
												to="/"
												className="font-bolder text-blue-800 hover:underline"
											>
												Rules
											</Link>{" "}
											and the{" "}
											<Link
												to="/"
												className="font-bolder text-blue-800 hover:underline"
											>
												Privacy Policy
											</Link>
											.
										</div>
									</Label>
								</FormControl>
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
							form.setValue("step", "services");
						}}
					>
						Back
					</ButtonImage>
					<ButtonImage variant="green" type="submit">
						Confirm Order
					</ButtonImage>
				</div>
			</InnerContainer>
		</>
	);
};
