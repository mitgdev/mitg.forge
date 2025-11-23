import { zodResolver } from "@hookform/resolvers/zod";
import { ORPCError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { List } from "@/components/List";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/ui/Form";
import { Textarea } from "@/ui/Textarea";

const FormSchema = z.object({
	email: z.email(),
	token: z.string().min(1),
});

type FormValues = z.infer<typeof FormSchema>;

export const AccountConfirmEmailForm = ({ email }: { email: string }) => {
	const navigate = useNavigate();
	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		mode: "onBlur",
		defaultValues: {
			email,
			token: "",
		},
	});
	const { mutateAsync: confirmEmail } = useMutation(
		api.query.miforge.accounts.confirmEmail.mutationOptions(),
	);

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			try {
				await confirmEmail({
					email: data.email,
					token: data.token,
				});

				toast.success("Email confirmed successfully.");

				navigate({
					to: "/login",
					replace: true,
				});
			} catch (error) {
				if (error instanceof ORPCError) {
					return toast.error(error.message);
				}

				toast.error("An unexpected error occurred. Please try again.");
			}
		},
		[confirmEmail, navigate],
	);

	return (
		<Container title="Confirm Email">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer className="p-0">
						<List zebra>
							<List.Item title="Name" borderless>
								<span className="font-semibold text-secondary text-sm">
									{email}
								</span>
							</List.Item>
							<List.Item title="Token" borderless>
								<FormField
									control={form.control}
									name="token"
									render={({ field: { onChange, value, ...field } }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5">
												<div className="flex w-full flex-col">
													<FormControl>
														<Textarea
															{...field}
															value={value}
															onChange={(event) => {
																onChange(event.target.value);
															}}
														/>
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
											</FormItem>
										);
									}}
								/>
							</List.Item>
						</List>
					</InnerContainer>
					<InnerContainer>
						<div className="flex flex-row flex-wrap items-end justify-end gap-2">
							<ButtonImage variant="info" type="submit">
								Confirm
							</ButtonImage>
						</div>
					</InnerContainer>
				</form>
			</Form>
		</Container>
	);
};
