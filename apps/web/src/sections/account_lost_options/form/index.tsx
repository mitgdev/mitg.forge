import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useConfig } from "@/sdk/contexts/config";
import { cn } from "@/sdk/utils/cn";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Form, FormField, FormItem } from "@/ui/Form";
import { Label } from "@/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/ui/RadioGroup";
import { DialogResetPassword } from "./DialogResetPassword";

const FormSchema = z.object({
	method: z.enum([
		"forgot_password",
		"forgot_password_recovery_key",
		"account_hacked",
		"change_email_recovery_key",
	]),
});

type FormValues = z.infer<typeof FormSchema>;

export const AccountLostOptionsForm = () => {
	const [dialogResetPasswordOpen, setDialogResetPasswordOpen] = useState(false);
	const { email } = useParams({
		from: "/_not_auth/account/lost/$email",
	});
	const { config } = useConfig();
	const mailerEnabled = config.mailer.enabled;
	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			method: mailerEnabled
				? "forgot_password"
				: "forgot_password_recovery_key",
		},
	});

	const handleSubmit = useCallback((data: FormValues) => {
		switch (data.method) {
			case "forgot_password":
				setDialogResetPasswordOpen(true);
				break;
			case "forgot_password_recovery_key":
				/**
				 * TODO: Send to a page where the user can input their recovery key to change their password.
				 */
				break;
			case "account_hacked":
				setDialogResetPasswordOpen(true);
				break;
			case "change_email_recovery_key":
				/**
				 * TODO: Send to a page where the user can input their recovery key to change their email.
				 */
				break;
			default:
				toast.error("Invalid option selected.");
		}
	}, []);

	return (
		<>
			{!mailerEnabled && (
				<Container title="Important Notice">
					<p className="text-secondary text-sm">
						Email functionality is currently disabled on this server. As a
						result, account recovery options that rely on email communication
						will not be available. Please contact the system administrator for
						assistance with account recovery.
					</p>
				</Container>
			)}

			<Container title="Specify Your Problem">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className="mb-3">
							<FormField
								control={form.control}
								name="method"
								render={({
									field: { value, onChange },
									formState: { defaultValues },
								}) => {
									return (
										<FormItem className="flex flex-1 flex-col">
											<RadioGroup
												className="flex-1 gap-0.5"
												defaultValue={defaultValues?.method}
												onValueChange={(value) => onChange(value)}
												value={value}
											>
												<InnerContainer>
													<div className="flex flex-col gap-1">
														<span className="font-bold text-secondary capitalize">
															Password
														</span>
														<div className="h-px bg-secondary" />
														<div className="ml-2">
															<div className="flex items-center gap-2">
																<RadioGroupItem
																	value="forgot_password"
																	id="forgot_password"
																	disabled={!mailerEnabled}
																/>
																<Label
																	htmlFor="forgot_password"
																	className={cn("cursor-pointer font-normal", {
																		"cursor-not-allowed": !mailerEnabled,
																	})}
																>
																	I have forgotten my password.
																</Label>
															</div>
															<div className="flex items-center gap-2">
																<RadioGroupItem
																	value="account_hacked"
																	id="account_hacked"
																	disabled={!mailerEnabled}
																/>
																<Label
																	htmlFor="account_hacked"
																	className={cn("cursor-pointer font-normal", {
																		"cursor-not-allowed": !mailerEnabled,
																	})}
																>
																	My account has been hacked.
																</Label>
															</div>
															<div className="flex items-center gap-2">
																<RadioGroupItem
																	value="forgot_password_recovery_key"
																	id="forgot_password_recovery_key"
																/>
																<Label
																	htmlFor="forgot_password_recovery_key"
																	className={cn("cursor-pointer font-normal", {
																		"cursor-not-allowed": !mailerEnabled,
																	})}
																>
																	Change my password with a recovery key.
																</Label>
															</div>
														</div>
													</div>
												</InnerContainer>
												<InnerContainer>
													<div className="flex flex-col gap-1">
														<span className="font-bold text-secondary capitalize">
															E-mail
														</span>
														<div className="h-px bg-secondary" />
														<div className="ml-2">
															<span className="text-secondary text-sm">
																I want to change the email address of my account
																instantly:
															</span>
															<div className="flex items-center gap-2">
																<RadioGroupItem
																	value="change_email_recovery_key"
																	id="change_email_recovery_key"
																	disabled={!mailerEnabled}
																/>
																<Label
																	htmlFor="change_email_recovery_key"
																	className={cn("cursor-pointer font-normal", {
																		"cursor-not-allowed": !mailerEnabled,
																	})}
																>
																	I have a recovery key
																</Label>
															</div>
														</div>
													</div>
												</InnerContainer>
											</RadioGroup>
										</FormItem>
									);
								}}
							/>
						</div>
						<InnerContainer>
							<div className="flex flex-row flex-wrap items-end justify-end gap-2">
								<ButtonImage variant="green" type="submit">
									Submit
								</ButtonImage>
							</div>
						</InnerContainer>
					</form>
				</Form>
			</Container>
			<DialogResetPassword
				email={email}
				open={dialogResetPasswordOpen}
				setOpen={setDialogResetPasswordOpen}
			/>
		</>
	);
};
