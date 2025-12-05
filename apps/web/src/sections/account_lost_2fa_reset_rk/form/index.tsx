import { zodResolver } from "@hookform/resolvers/zod";
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
import { Form } from "@/ui/Form";

const FormSchema = z.object({
	recoveryKey: z
		.string()
		.min(1, "Recovery key is required")
		.max(23, "Recovery key must be at most 23 characters"),
});

type FormValues = z.infer<typeof FormSchema>;

export const AccountLost2FAResetRkForm = () => {
	const navigate = useNavigate();

	const { email } = useParams({
		from: "/_not_auth/account/lost/$email/disabled_2fa_rk/",
	});

	const {
		mutateAsync: resetTwoFactorWithRecoveryKey,
		isPending: isResetting,
		isSuccess: isResetTwoFactorWithRecoveryKeySuccess,
	} = useMutation(
		api.query.miforge.lost.resetTwoFactorWithRecoveryKey.mutationOptions(),
	);

	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			recoveryKey: "",
		},
	});

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			withORPCErrorHandling(
				async () => {
					await resetTwoFactorWithRecoveryKey({
						email,
						recoveryKey: data.recoveryKey,
					});
				},
				{
					onSuccess: async () => {
						toast.success("2FA has been reset successfully.");

						navigate({
							to: "/login",
							replace: true,
						});
					},
				},
			);
		},
		[resetTwoFactorWithRecoveryKey, email, navigate],
	);

	return (
		<Container title="Reset 2FA with Recovery Key">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer>
						<div className="flex flex-col gap-1 p-1">
							<FormFieldRecoveryKey
								disabled={isResetting || isResetTwoFactorWithRecoveryKeySuccess}
								form={form}
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
								disabled={isResetting || isResetTwoFactorWithRecoveryKeySuccess}
								loading={isResetting}
							>
								Reset 2FA
							</ButtonImage>
						</div>
					</InnerContainer>
				</form>
			</Form>
		</Container>
	);
};
