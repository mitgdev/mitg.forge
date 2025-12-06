import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { useTwoFactor } from "@/sdk/hooks/useTwoFactor";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { InnerContainer } from "@/ui/Container/Inner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/ui/Dialog";
import { FormFieldTwoFactorToken } from "../FormFieldTwoFactorToken";

type Props<TFormValues extends FieldValues> = {
	error?: Error | null;
	disabled?: boolean;
	loading?: boolean;
	form: UseFormReturn<TFormValues>;
	handleSubmit: (data: TFormValues) => Promise<void>;
};

export function TwoFactorDialog<
	TFormValues extends { twoFactorToken?: string } & FieldValues,
>({ form, handleSubmit, disabled, loading, error }: Props<TFormValues>) {
	const { setTwoFactorOpen, twoFactorOpen } = useTwoFactor(error);

	const handleClose = () => {
		form.resetField("twoFactorToken" as Path<TFormValues>);
		setTwoFactorOpen(false);
	};

	return (
		<Dialog
			open={twoFactorOpen}
			onOpenChange={(open) => {
				if (!open) {
					return handleClose();
				}

				setTwoFactorOpen(open);
			}}
		>
			<DialogContent title="Two-Factor Authentication Required">
				<DialogHeader className="hidden">
					<DialogTitle>Two-Factor Authentication Required</DialogTitle>
					<DialogDescription>
						Your account has two-factor authentication enabled. Please enter the
						confirmation code from your authenticator app to continue.
					</DialogDescription>
				</DialogHeader>
				<InnerContainer>
					<FormFieldTwoFactorToken form={form} disabled={disabled} />
				</InnerContainer>
				<InnerContainer className="mb-0">
					<div className="flex flex-row justify-end gap-1">
						<ButtonImage
							variant="info"
							disabled={disabled}
							loading={loading}
							onClick={handleClose}
						>
							Close
						</ButtonImage>
						<ButtonImage
							type="button"
							variant="green"
							disabled={disabled}
							loading={loading}
							onClick={form.handleSubmit(handleSubmit)}
						>
							Confirm
						</ButtonImage>
					</div>
				</InnerContainer>
			</DialogContent>
		</Dialog>
	);
}
