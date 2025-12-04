import { zodResolver } from "@hookform/resolvers/zod";
import { simplePasswordSchema } from "@miforge/core/schemas";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { api } from "@/sdk/lib/api/factory";
import { withORPCErrorHandling } from "@/sdk/utils/orpc";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/ui/Dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/ui/Form";
import { Input } from "@/ui/Input";
import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { Separator } from "@/ui/Separator";

const FormSchema = z.object({
	email: z.email(),
	password: simplePasswordSchema,
	twoFactorToken: z
		.string()
		.min(1, "Code is required")
		.max(6, "Code is too long")
		.optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export const LoginSection = () => {
	const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
	const router = useRouter();
	const navigate = useNavigate();
	const { mutateAsync } = useMutation(
		api.query.miforge.accounts.login.mutationOptions(),
	);

	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			withORPCErrorHandling(
				async () => {
					await mutateAsync({
						email: data.email,
						password: data.password,
						twoFactorCode: data.twoFactorToken,
					});
				},
				{
					onSuccess: async () => {
						router.invalidate().finally(() => {
							navigate({
								to: "/account",
								reloadDocument: true,
							});
						});
					},
					onORPCError: async (error) => {
						const hasTwoFactorCause =
							error?.data?.cause === "TWO_FACTOR_TOKEN_MISSING";

						if (hasTwoFactorCause) {
							setShowTwoFactorDialog(true);
						}
					},
				},
			);
		},
		[mutateAsync, navigate, router],
	);

	return (
		<Section>
			<SectionHeader color="green">
				<h2 className="section-title">Account Management</h2>
			</SectionHeader>

			<InnerSection>
				<Container title="Important Notice" innerContainer>
					<p className="text-secondary text-sm">
						We have changed the login process! Account names have been
						abolished. To log in, you only need your <b>password</b> and the
						account's <b>email address</b>. <br /> You have <b>forgotten</b>{" "}
						your <b>email address</b> but you still <b>know</b> the{" "}
						<b>account name</b> which had been used for your account? <br />
						Get your email address here:{" "}
						<Link
							to="/account/lost"
							className="text-blue-800 text-sm hover:underline"
						>
							Lost Account Recovery
						</Link>
					</p>
				</Container>
				<Container title="Account Login">
					<InnerContainer className="p-1">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)}>
								<div className="flex w-full flex-col gap-3 md:flex-row">
									<div className="flex flex-1 flex-col gap-1">
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => {
												return (
													<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-start">
														<FormLabel className="min-w-25">
															E-mail Address:{" "}
														</FormLabel>
														<div className="flex w-full flex-col">
															<FormControl>
																<Input {...field} className="flex-1" />
															</FormControl>
															<FormMessage className="text-red-500" />
														</div>
													</FormItem>
												);
											}}
										/>
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => {
												return (
													<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-start">
														<FormLabel className="min-w-25">
															Password:{" "}
														</FormLabel>
														<div className="flex w-full flex-col">
															<FormControl>
																<Input
																	type="password"
																	{...field}
																	className="flex-1"
																/>
															</FormControl>
															<FormMessage className="text-red-500" />
														</div>
													</FormItem>
												);
											}}
										/>
									</div>
									<div className="flex flex-row-reverse flex-wrap gap-1 self-end md:flex-col md:self-start">
										<ButtonImage type="submit" variant="info">
											Login
										</ButtonImage>
										<ButtonImageLink variant="info" to="/account/lost">
											Lost Account
										</ButtonImageLink>
									</div>
								</div>

								<Dialog
									open={showTwoFactorDialog}
									onOpenChange={setShowTwoFactorDialog}
								>
									<DialogContent title="Two-Factor Authentication Required">
										<DialogHeader className="hidden">
											<DialogTitle>
												Two-Factor Authentication Required
											</DialogTitle>
											<DialogDescription>
												Your account has two-factor authentication enabled.
												Please enter the confirmation code from your
												authenticator app to continue.
											</DialogDescription>
										</DialogHeader>
										<InnerContainer>
											<FormField
												control={form.control}
												name="twoFactorToken"
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
																		maxLength={6}
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
										</InnerContainer>
										<InnerContainer className="mb-0">
											<div className="flex flex-row justify-end gap-1">
												<ButtonImage
													variant="info"
													onClick={() => {
														setShowTwoFactorDialog(false);
													}}
												>
													Close
												</ButtonImage>
												<ButtonImage
													type="button"
													variant="green"
													onClick={form.handleSubmit(handleSubmit)}
												>
													Confirm
												</ButtonImage>
											</div>
										</InnerContainer>
									</DialogContent>
								</Dialog>
							</form>
						</Form>
					</InnerContainer>
					<Separator title="and" />
					<InnerContainer className="flex flex-col gap-1 p-3">
						<h4 className="font-bold font-verdana text-base text-secondary">
							Two-Factor Authentication (2FA)
						</h4>
						<span className="font-verdana text-secondary text-xs">
							If your account has two-factor authentication enabled, you will be
							prompted to enter your authenticator code after successfully
							entering your email and password. This extra security layer helps
							protect your account from unauthorized access.
						</span>
					</InnerContainer>
				</Container>
			</InnerSection>
		</Section>
	);
};
