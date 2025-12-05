import { zodResolver } from "@hookform/resolvers/zod";
import { simplePasswordSchema } from "@miforge/core/schemas";
import { ORPCError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Countdown } from "@/components/Countdown";
import { useConfig } from "@/sdk/contexts/config";
import { api } from "@/sdk/lib/api/factory";
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

const BaseSchema = z.object({
	newEmail: z.email(),
});

const FormSchemaWithPassword = z.object({
	...BaseSchema.shape,
	password: simplePasswordSchema,
});

const FormSchemaWithoutPassword = z.object({
	...BaseSchema.shape,
});

type FormValuesWithPassword = z.infer<typeof FormSchemaWithPassword>;
type FormValuesWithoutPassword = z.infer<typeof FormSchemaWithoutPassword>;

type FormValues = FormValuesWithPassword | FormValuesWithoutPassword;

export const AccountChangeEmailForm = () => {
	const [redirecting, setRedirecting] = useState<Date | null>(null);
	const { config } = useConfig();
	const navigate = useNavigate();

	const {
		mutateAsync: changeEmailWithPassword,
		isPending: isPendingChangeEmailWithPassword,
		isSuccess: isSuccessChangeEmailWithPassword,
	} = useMutation(
		api.query.miforge.accounts.email.changeWithPassword.mutationOptions(),
	);

	const {
		mutateAsync: generateChangeEmailToken,
		isPending: isPendingGenerateChangeEmailToken,
	} = useMutation(
		api.query.miforge.accounts.email.generateChange.mutationOptions(),
	);

	const needConfirmation = config.account.emailChangeConfirmationRequired;

	const schema = useMemo(() => {
		return needConfirmation
			? FormSchemaWithoutPassword
			: FormSchemaWithPassword;
	}, [needConfirmation]);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			newEmail: "",
			password: "",
		},
		mode: "onTouched",
	});

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			try {
				if (!needConfirmation && "password" in data) {
					await changeEmailWithPassword({
						newEmail: data.newEmail,
						password: data.password,
					});

					toast.success(
						"Email changed successfully. You need to login again. All your sessions have been revoked.",
					);

					// Wait for 5 seconds to let the user read the toast
					const date = new Date();
					date.setSeconds(date.getSeconds() + 5);
					setRedirecting(date);
					await new Promise((resolve) => setTimeout(resolve, 5000));

					navigate({
						to: "/login",
						replace: true,
						reloadDocument: true,
					});

					return;
				}

				if (needConfirmation) {
					await generateChangeEmailToken({ newEmail: data.newEmail });

					toast.success(
						"An email has been sent to your address. Please follow the instructions to confirm the change.",
					);

					navigate({ to: "/account/details" });
					return;
				}
			} catch (error) {
				if (error instanceof ORPCError) {
					return toast.error(`${error.message}`);
				}

				toast.error("An unexpected error occurred. Please try again.");
			}
		},
		[
			changeEmailWithPassword,
			navigate,
			needConfirmation,
			generateChangeEmailToken,
		],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <need to trigger form reset when config changes>
	useEffect(() => {
		form.reset();
	}, [needConfirmation, form.reset]);

	return (
		<Container title="Change Email">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer>
						<div className="flex flex-col gap-1 p-1">
							{!needConfirmation && (
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
												<FormLabel className="min-w-35">Password:</FormLabel>
												<div className="flex w-full flex-col">
													<FormControl>
														<Input
															{...field}
															className="max-w-sm"
															type="password"
															autoComplete="off"
														/>
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
											</FormItem>
										);
									}}
								/>
							)}
							<FormField
								control={form.control}
								name="newEmail"
								render={({ field }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
											<FormLabel className="min-w-35">New Email:</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input
														{...field}
														className="max-w-sm"
														type="email"
														autoComplete="off"
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
					{redirecting && (
						<InnerContainer>
							<p className="text-center text-secondary">
								You are being redirected to login. Please wait
								<Countdown targetDate={redirecting} />.
							</p>
						</InnerContainer>
					)}
					<InnerContainer>
						<div className="flex flex-row flex-wrap items-end justify-end gap-2">
							<ButtonImageLink variant="info" to="/account/details">
								Back
							</ButtonImageLink>
							<ButtonImage
								variant="info"
								type="submit"
								disabled={
									isPendingChangeEmailWithPassword ||
									isSuccessChangeEmailWithPassword ||
									isPendingGenerateChangeEmailToken
								}
							>
								Change Email
							</ButtonImage>
						</div>
					</InnerContainer>
				</form>
			</Form>
		</Container>
	);
};
