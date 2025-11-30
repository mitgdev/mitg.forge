import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { api } from "@/sdk/lib/api/factory";
import { withORPCErrorHandling } from "@/sdk/utils/orpc";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/ui/Form";
import { Input } from "@/ui/Input";

const FormSchema = z.object({
	email: z.email("Invalid email address").max(60),
});

type FormValues = z.infer<typeof FormSchema>;
export const AccountLostForm = () => {
	const navigate = useNavigate();
	const { mutateAsync: findByEmail } = useMutation(
		api.query.miforge.lost.findByEmail.mutationOptions(),
	);

	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
		},
	});

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			await withORPCErrorHandling(async () => {
				await findByEmail({
					email: data.email,
				});

				navigate({
					to: "/account/lost/$email",
					params: {
						email: data.email,
					},
				});
			});
		},
		[findByEmail, navigate],
	);

	return (
		<Container title="Recover by Email">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer>
						<div className="flex flex-col gap-1 p-1">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
											<FormLabel className="min-w-40">Email:</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input {...field} className="max-w-sm" type="email" />
												</FormControl>
												<FormMessage className="text-red-500" />
											</div>
										</FormItem>
									);
								}}
							/>
						</div>
					</InnerContainer>
					<InnerContainer>
						<div className="flex flex-row flex-wrap items-end justify-end gap-2">
							<ButtonImage variant="info" type="submit">
								Submit
							</ButtonImage>
						</div>
					</InnerContainer>
				</form>
			</Form>
		</Container>
	);
};
