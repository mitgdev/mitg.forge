import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useSession } from "@/sdk/contexts/session";
import { Container } from "@/ui/Container";
import { Form } from "@/ui/Form";
import { ShopDonateStepProviders } from "./providers";
import { ShopDonateStepReview } from "./review";
import { ShopDonateStepServices } from "./services";

const FormSchema = z.object({
	step: z.enum(["providers", "services", "review"]),
	providerId: z.number(),
	serviceId: z.number(),
	consent: z.boolean().refine((val) => val === true, {
		message: "You must give consent to proceed",
	}),
});

export type FormValues = z.infer<typeof FormSchema>;

export const ShopDonateForm = () => {
	const { session } = useSession();

	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			step: "providers",
		},
	});

	const step = form.watch("step");

	const title = useMemo(() => {
		switch (step) {
			case "providers":
				return "Select Payment Method";
			case "services":
				return "Select Products";
			case "review":
				return "Confirm Your Order";
			default:
				return "";
		}
	}, [step]);

	const handleSubmit = useCallback(async (data: FormValues) => {
		console.log("Form submitted:", data);
	}, []);

	return (
		<div className="flex flex-col gap-5 pt-2">
			<div className="flex items-center justify-center">
				<span className="text-center font-bold text-lg text-secondary">
					Order for: {session?.email}
				</span>
			</div>
			<Container title={title}>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<ShopDonateStepProviders />
						<ShopDonateStepServices />
						<ShopDonateStepReview />
					</form>
				</Form>
			</Container>
		</div>
	);
};
