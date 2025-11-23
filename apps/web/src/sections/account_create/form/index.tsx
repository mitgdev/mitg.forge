import { zodResolver } from "@hookform/resolvers/zod";
import { ORPCError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useConfig } from "@/sdk/contexts/config";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Checkbox } from "@/ui/Checkbox";
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
import { Label } from "@/ui/Label";

const FormSchema = z
	.object({
		email: z.email(),
		password: z
			.string()
			.min(8)
			.max(100)
			.regex(/[A-Z]/, {
				message: "Password must contain at least one uppercase letter",
			})
			.regex(/[\W_]/, {
				message: "Password must contain at least one special character",
			}),
		confirmPassword: z.string().max(100),
		terms: z.boolean().refine((val) => val === true, {
			message: "You must accept the terms and conditions",
		}),
		consent: z.boolean().refine((val) => val === true, {
			message: "You must give consent to proceed",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type FormValues = z.infer<typeof FormSchema>;

export const AccountCreateForm = () => {
	const { config } = useConfig();
	const router = useRouter();
	const navigate = useNavigate();
	const { mutateAsync: login } = useMutation(
		api.query.miforge.accounts.login.mutationOptions(),
	);
	const { mutateAsync: register } = useMutation(
		api.query.miforge.accounts.create.mutationOptions(),
	);
	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		mode: "onBlur",
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			consent: false,
			terms: false,
		},
	});

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			try {
				await register({
					email: data.email,
					password: data.password,
					confirmPassword: data.confirmPassword,
				});

				if (config.account.emailConfirmationRequired) {
					toast.success(
						"Account created successfully! Please check your email to confirm your account.",
					);

					navigate({
						to: "/account/$email/confirm",
						params: { email: data.email },
						// To prevent going back to the form after confirmation
						replace: true,
					});
					return;
				}

				toast.success("Account created successfully! Logging you in...");

				await login({
					email: data.email,
					password: data.password,
				});

				router.invalidate().finally(() => {
					navigate({
						to: "/account",
						reloadDocument: true,
					});
				});
			} catch (error) {
				if (error instanceof ORPCError) {
					return toast.error(`${error.message}`);
				}

				toast.error("An unexpected error occurred. Please try again.");
			}
		},
		[register, router, navigate, config, login],
	);

	return (
		<Container title="New Account">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer>
						<div className="flex flex-col gap-1 p-1">
							<FormField
								control={form.control}
								name="email"
								render={({ field: { onChange, value, ...field } }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5">
											<FormLabel>Email:</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input
														{...field}
														placeholder="E-mail..."
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
								name="password"
								render={({ field: { onChange, value, ...field } }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5">
											<FormLabel>Password:</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input
														{...field}
														placeholder="Password..."
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
										<FormItem className="flex flex-1 flex-col gap-0.5">
											<FormLabel>Confirm Password:</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input
														{...field}
														placeholder="Confirm password..."
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
						</div>
					</InnerContainer>
					<InnerContainer className="p-2">
						<div className="flex flex-col gap-3">
							<FormField
								control={form.control}
								name="terms"
								render={({ field: { value, onChange } }) => {
									return (
										<FormItem className="flex flex-col items-start gap-2">
											<FormControl>
												<Label
													htmlFor="terms"
													className="flex flex-row items-center gap-2"
												>
													<Checkbox
														checked={value || false}
														onCheckedChange={(checked) => onChange(checked)}
														id="terms"
													/>
													<div className="text-secondary text-sm leading-tight">
														I agree to the{" "}
														<Link
															to="/"
															className="font-bolder text-blue-800 hover:underline"
														>
															Service agreement
														</Link>{" "}
														, the{" "}
														<Link
															to="/"
															className="font-bolder text-blue-800 hover:underline"
														>
															Rules
														</Link>{" "}
														and the{" "}
														<Link
															to="/"
															className="font-bolder text-blue-800 hover:underline"
														>
															Privacy Policy
														</Link>
														.
													</div>
												</Label>
											</FormControl>
											<FormMessage className="text-red-500" />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={form.control}
								name="consent"
								render={({ field: { value, onChange } }) => {
									return (
										<FormItem className="flex flex-col items-start gap-2">
											<FormControl>
												<Label
													htmlFor="consent"
													className="flex flex-row items-center gap-2"
												>
													<Checkbox
														checked={value || false}
														onCheckedChange={(checked) => onChange(checked)}
														id="consent"
													/>
													<div className="text-secondary text-sm leading-tight">
														I consent to saving play sessions for the sole
														purpose of improving the gaming experience or
														enforcing the Rules. Saved play sessions will
														contain the entire user experience, including, but
														not limited to, chats and player interaction. I am
														aware that I can revoke my consent to the storing of
														my play sessions at any time on my account
														management page.
													</div>
												</Label>
											</FormControl>
											<FormMessage className="text-red-500" />
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
							<ButtonImage variant="info" type="submit">
								Create
							</ButtonImage>
						</div>
					</InnerContainer>
				</form>
			</Form>
		</Container>
	);
};
