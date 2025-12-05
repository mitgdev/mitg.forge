import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "@miforge/core/schemas";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

const FormSchema = z
	.object({
		password: passwordSchema,
		confirmPassword: passwordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type FormValues = z.infer<typeof FormSchema>;

export const AccountLostPasswordResetForm = () => {
	const navigate = useNavigate();
	const { token } = useParams({
		from: "/_not_auth/account/lost/$token/password_reset/",
	});
	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		mode: "onBlur",
	});

	const {
		mutateAsync: resetPasswordWithToken,
		isPending: isResettingPassword,
		isSuccess: isPasswordResetSuccessfully,
	} = useMutation(
		api.query.miforge.lost.resetPasswordWithToken.mutationOptions(),
	);

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			await withORPCErrorHandling(
				async () => {
					await resetPasswordWithToken({
						token,
						newPassword: data.password,
						confirmNewPassword: data.confirmPassword,
					});
				},
				{
					onSuccess: async () => {
						toast.success("Password has been reset successfully.");

						await new Promise((resolve) => setTimeout(resolve, 500));

						navigate({
							to: "/login",
							replace: true,
						});
					},
				},
			);
		},
		[token, resetPasswordWithToken, navigate],
	);

	return (
		<Container title="Password Reset">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer>
						<div className="flex flex-col gap-1 p-1">
							<FormField
								control={form.control}
								name="password"
								render={({ field: { onChange, value, ...field } }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
											<FormLabel className="min-w-35">Password:</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input
														{...field}
														placeholder="Password..."
														disabled={isResettingPassword}
														type="password"
														value={value}
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
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field: { onChange, value, ...field } }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
											<FormLabel className="min-w-35">
												Confirm Password:
											</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input
														{...field}
														placeholder="Confirm password..."
														type="password"
														disabled={isResettingPassword}
														value={value}
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
							<ButtonImage
								variant="info"
								type="submit"
								disabled={isResettingPassword || isPasswordResetSuccessfully}
								loading={isResettingPassword}
							>
								Change
							</ButtonImage>
						</div>
					</InnerContainer>
				</form>
			</Form>
		</Container>
	);
};
