import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Countdown } from "@/components/Countdown";
import { api } from "@/sdk/lib/api/factory";
import { withORPCErrorHandling } from "@/sdk/utils/orpc";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { InnerContainer } from "@/ui/Container/Inner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/ui/Dialog";

type Props = {
	email: string;
	open: boolean;
	setOpen: (open: boolean) => void;
};

export const DialogResetPassword = ({ email, open, setOpen }: Props) => {
	const navigate = useNavigate();
	const [redirecting, setRedirecting] = useState<Date | null>(null);
	const {
		mutateAsync: generatePasswordReset,
		isSuccess: isPasswordResetEmailSent,
		isPending: isPendingGeneratePasswordReset,
	} = useMutation(
		api.query.miforge.lost.generatePasswordReset.mutationOptions(),
	);

	const handleSubmit = useCallback(async () => {
		await withORPCErrorHandling(
			async () => {
				await generatePasswordReset({
					email: email,
				});
			},
			{
				onSuccess: async () => {
					toast.success("Password reset email sent. Please check your inbox.");

					setRedirecting(() => {
						const date = new Date();
						date.setSeconds(date.getSeconds() + 5);
						return date;
					});
					await new Promise((resolve) => setTimeout(resolve, 5000));

					navigate({
						to: "/login",
						replace: true,
					});
				},
			},
		);
	}, [email, navigate, generatePasswordReset]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				title="Reset Password"
				showCloseButton={
					!isPendingGeneratePasswordReset && !isPasswordResetEmailSent
				}
			>
				<DialogTitle className="hidden">Reset Password</DialogTitle>
				<InnerContainer>
					<DialogHeader>
						<DialogDescription>
							A email will be sent to your registered email address with
							instructions to reset your password.
						</DialogDescription>
					</DialogHeader>
				</InnerContainer>
				{redirecting && (
					<InnerContainer>
						<p className="text-center text-secondary">
							Redirecting in <Countdown targetDate={redirecting} />
						</p>
					</InnerContainer>
				)}
				<InnerContainer className="mb-0">
					<div className="flex flex-row justify-between gap-2 md:justify-end">
						<ButtonImage
							variant="red"
							disabled={
								isPendingGeneratePasswordReset || isPasswordResetEmailSent
							}
							onClick={() => {
								setOpen(false);
							}}
						>
							Close
						</ButtonImage>
						<ButtonImage
							variant="info"
							type="button"
							onClick={handleSubmit}
							disabled={
								isPendingGeneratePasswordReset || isPasswordResetEmailSent
							}
						>
							Send
						</ButtonImage>
					</div>
				</InnerContainer>
			</DialogContent>
		</Dialog>
	);
};
