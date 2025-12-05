import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "@miforge/core/schemas";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FormFieldRecoveryKey } from "@/components/Forms/FormFieldRecoveryKey";
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

const FormSchema = z
	.object({
		recoveryKey: z
			.string()
			.min(1, "Recovery key is required")
			.max(23, "Recovery key must be at most 23 characters"),
		password: passwordSchema,
		confirmPassword: passwordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type FormValues = z.infer<typeof FormSchema>;

export const AccountLostPasswordResetRkForm = () => {
	const { email } = useParams({
		from: "/_not_auth/account/lost/$email/password_reset_rk/",
	});
	const navigate = useNavigate();

	const {
		mutateAsync: resetPasswordWithRecoveryKey,
		isPending,
		isSuccess,
	} = useMutation(
		api.query.miforge.lost.resetPasswordWithRecoveryKey.mutationOptions(),
	);

	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
	});

	const handleSubmit = useCallback(
		async (values: FormValues) => {
			await withORPCErrorHandling(
				async () => {
					await resetPasswordWithRecoveryKey({
						email,
						recoveryKey: values.recoveryKey,
						confirmNewPassword: values.confirmPassword,
						newPassword: values.password,
					});
				},
				{
					onSuccess: async () => {
						toast.success("Password changed successfully.");

						navigate({
							to: "/login",
							replace: true,
						});
					},
				},
			);
		},
		[email, resetPasswordWithRecoveryKey, navigate],
	);

	return (
		<Container title="Reset Password RK">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer>
						<div className="flex flex-col gap-1 p-1">
							<FormFieldRecoveryKey
								disabled={isPending || isSuccess}
								form={form}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field: { onChange, value, ...field } }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
											<FormLabel className="min-w-35">New Password:</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input
														{...field}
														placeholder="Password..."
														type="password"
														disabled={isPending || isSuccess}
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
														disabled={isPending || isSuccess}
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
							<ButtonImageLink variant="info" to="/">
								Back
							</ButtonImageLink>
							<ButtonImage
								variant="info"
								type="submit"
								disabled={isPending || isSuccess}
								loading={isPending}
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
