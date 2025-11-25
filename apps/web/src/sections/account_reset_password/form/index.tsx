import { zodResolver } from "@hookform/resolvers/zod";
import { ORPCError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
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
import { Textarea } from "@/ui/Textarea";

const BaseSchema = z.object({
	newPassword: z
		.string()
		.min(8)
		.max(100)
		.regex(/[A-Z]/, {
			message: "Password must contain at least one uppercase letter",
		})
		.regex(/[\W_]/, {
			message: "Password must contain at least one special character",
		}),
	confirmNewPassword: z.string().max(100),
});

const FormSchemaWithCode = z.object({
	...BaseSchema.shape,
	code: z.string().max(100),
});

const FormSchemaWithoutCode = z.object({
	...BaseSchema.shape,
	oldPassword: z.string().max(100),
});

type FormValuesWithCode = z.infer<typeof FormSchemaWithCode>;
type FormValuesWithoutCode = z.infer<typeof FormSchemaWithoutCode>;

type FormValues = FormValuesWithCode | FormValuesWithoutCode;

export const AccountResetPasswordForm = () => {
	const { config } = useConfig();
	const needConfirmation = config.account.passwordResetConfirmationRequired;
	const navigate = useNavigate();

	const {
		mutateAsync: changePasswordWithOld,
		isPending: isPendingChangePasswordWithOld,
	} = useMutation(
		api.query.miforge.accounts.password.changeWithOld.mutationOptions(),
	);

	const schema = useMemo(() => {
		return needConfirmation ? FormSchemaWithCode : FormSchemaWithoutCode;
	}, [needConfirmation]);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			newPassword: "",
			confirmNewPassword: "",
			code: "",
			oldPassword: "",
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <need to trigger form reset when config changes>
	useEffect(() => {
		form.reset();
	}, [needConfirmation, form.reset]);

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			try {
				if (needConfirmation && "code" in data) {
				}

				if (!needConfirmation && "oldPassword" in data) {
					await changePasswordWithOld({
						oldPassword: data.oldPassword,
						newPassword: data.newPassword,
						confirmPassword: data.confirmNewPassword,
					});

					toast.success("Password changed successfully");

					navigate({
						to: "/account/details",
						replace: true,
					});

					return;
				}
			} catch (error) {
				if (error instanceof ORPCError) {
					return toast.error(`${error.message}`);
				}

				toast.error("An unexpected error occurred. Please try again.");
			}
		},
		[needConfirmation, changePasswordWithOld, navigate],
	);

	return (
		<Container title="Reset Password">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer>
						<div className="flex flex-col gap-1 p-1">
							{!needConfirmation && (
								<FormField
									control={form.control}
									name="oldPassword"
									render={({ field }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
												<FormLabel className="min-w-35">
													Old Password:
												</FormLabel>
												<div className="flex w-full flex-col">
													<FormControl>
														<Input
															{...field}
															className="max-w-sm"
															type="password"
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
								name="newPassword"
								render={({ field }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
											<FormLabel className="min-w-35">New Password:</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input
														{...field}
														className="max-w-sm"
														type="password"
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
								name="confirmNewPassword"
								render={({ field }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
											<FormLabel className="min-w-35">
												Confirm Password:
											</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input
														{...field}
														className="max-w-sm"
														type="password"
													/>
												</FormControl>
												<FormMessage className="text-red-500" />
											</div>
										</FormItem>
									);
								}}
							/>
							{needConfirmation && (
								<FormField
									control={form.control}
									name="code"
									render={({ field }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
												<FormLabel className="min-w-35">Code:</FormLabel>
												<div className="flex w-full flex-col">
													<FormControl>
														<Textarea {...field} className="max-w-sm" />
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
											</FormItem>
										);
									}}
								/>
							)}
						</div>
					</InnerContainer>
					<InnerContainer className="p-1">
						<div className="flex flex-row flex-wrap items-end justify-end gap-2">
							<ButtonImageLink variant="info" to="/account/details">
								Back
							</ButtonImageLink>
							{needConfirmation && (
								<ButtonImage variant="info" type="button" onClick={() => null}>
									Generate Code
								</ButtonImage>
							)}
							{!needConfirmation && (
								<ButtonImage
									variant="info"
									type="submit"
									disabled={isPendingChangePasswordWithOld}
								>
									Reset Password
								</ButtonImage>
							)}
						</div>
					</InnerContainer>
				</form>
			</Form>
		</Container>
	);
};
