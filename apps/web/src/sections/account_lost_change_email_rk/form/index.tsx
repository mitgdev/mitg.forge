import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FormFieldEmail } from "@/components/Forms/FormFieldEmail";
import { FormFieldRecoveryKey } from "@/components/Forms/FormFieldRecoveryKey";
import { TwoFactorDialog } from "@/components/Forms/TwoFactorDialog";
import { api } from "@/sdk/lib/api/factory";
import { withORPCErrorHandling } from "@/sdk/utils/orpc";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Form } from "@/ui/Form";

const FormSchema = z.object({
	recoveryKey: z
		.string()
		.min(1, "Recovery key is required")
		.max(23, "Recovery key must be at most 23 characters"),
	email: z.email("Invalid email address"),
	twoFactorToken: z
		.string()
		.min(1, "Code is required")
		.max(6, "Code is too long")
		.optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export const AccountLostChangeEmailRkForm = () => {
	const navigate = useNavigate();
	const { email } = useParams({
		from: "/_not_auth/account/lost/$email/change_email_rk/",
	});

	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
	});

	const {
		mutateAsync: changeEmailWithRecoveryKey,
		isPending,
		isSuccess,
		error,
	} = useMutation(
		api.query.miforge.lost.changeEmailWithRecoveryKey.mutationOptions(),
	);

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			withORPCErrorHandling(
				async () => {
					await changeEmailWithRecoveryKey({
						recoveryKey: data.recoveryKey,
						newEmail: data.email,
						oldEmail: email,
						token: data.twoFactorToken,
					});
				},
				{
					onSuccess: async () => {
						toast.success(
							"Email changed successfully. Please log in with your new email.",
						);

						await new Promise((resolve) => setTimeout(resolve, 1000));

						navigate({
							to: "/login",
						});
					},
				},
			);
		},
		[changeEmailWithRecoveryKey, email, navigate],
	);

	return (
		<Container title="Change Email RK">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<TwoFactorDialog
						form={form}
						handleSubmit={handleSubmit}
						disabled={isPending || isSuccess}
						loading={isPending}
						error={error}
					/>
					<InnerContainer className="flex flex-col gap-2 p-2 text-secondary text-sm leading-tight">
						<span className="font-bold text-base text-error">
							Please read this warning carefully as it contains important
							security information!
						</span>
						<span>
							Changing the email address associated with your account using the
							invalidate all existing sessions, and you will need to log in
							again with the new email address.
						</span>
						<span>
							If your email has a 2FA authenticator app linked, you will need to
							provide the 2FA code during the process of changing your email
							address. And after changing the email, all existing 2FA
							authenticator app links will be invalidated, and you will need to
							set up a new link with the new email address.
						</span>
					</InnerContainer>
					<InnerContainer>
						<div className="flex flex-col gap-1 p-1">
							<FormFieldRecoveryKey form={form} />
							<FormFieldEmail form={form} label="New Email:" />
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
