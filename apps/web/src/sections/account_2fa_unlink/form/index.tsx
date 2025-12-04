import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { api } from "@/sdk/lib/api/factory";
import { withORPCErrorHandling } from "@/sdk/utils/orpc";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
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
	code: z.string().min(1, "Code is required").max(6, "Code is too long"),
});

type FormValues = z.infer<typeof FormSchema>;

export const Account2FAUnlinkForm = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			code: "",
		},
	});

	const {
		mutateAsync: unlinkTwoFactor,
		isPending: isUnlinkPending,
		isSuccess: isUnlinkSuccessful,
	} = useMutation(
		api.query.miforge.accounts.twoFactor.disable.mutationOptions(),
	);

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			withORPCErrorHandling(
				async () => {
					await unlinkTwoFactor({
						token: data.code,
					});
				},
				{
					onSuccess: async () => {
						await queryClient.invalidateQueries({
							queryKey: api.query.miforge.accounts.details.queryKey(),
						});

						toast.success("Two-Factor Authentication unlinked successfully.");

						navigate({ to: "/account/details" });
					},
				},
			);
		},
		[unlinkTwoFactor, navigate, queryClient],
	);

	return (
		<Container title="Unlink Two-Factor Authentication">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer>
						<div className="flex flex-col gap-1 p-1">
							<FormField
								control={form.control}
								name="code"
								render={({ field: { onChange, value, ...field } }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
											<FormLabel className="min-w-35">
												Confirmation Code:
											</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input
														{...field}
														placeholder="Confirmation Code..."
														value={value}
														disabled={isUnlinkPending || isUnlinkSuccessful}
														onChange={(event) => {
															onChange(event.target.value);
														}}
														className="max-w-sm"
													/>
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
							<ButtonImageLink variant="info" to="/">
								Back
							</ButtonImageLink>

							<ButtonImage
								variant="info"
								type="submit"
								disabled={isUnlinkPending || isUnlinkSuccessful}
								loading={isUnlinkPending}
							>
								Unlink
							</ButtonImage>
						</div>
					</InnerContainer>
				</form>
			</Form>
		</Container>
	);
};
