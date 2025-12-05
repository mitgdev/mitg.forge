import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { QRCode } from "@/components/QRCode";
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

const FormSetupSchema = z.object({
	recoveryKey: z
		.string()
		.min(1, "Recovery key is required")
		.max(23, "Recovery key must be at most 23 characters"),
});

const FormConfirmSchema = z.object({
	code: z.string().min(1, "Code is required").max(6, "Code is too long"),
});

type FormSetupValues = z.infer<typeof FormSetupSchema>;
type FormConfirmValues = z.infer<typeof FormConfirmSchema>;

export const Account2FALinkForm = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {
		data: setupData,
		mutateAsync: setupTwoFactor,
		isSuccess: isSetupSuccessful,
		isPending: isSetupPending,
	} = useMutation(api.query.miforge.accounts.twoFactor.setup.mutationOptions());

	const {
		mutateAsync: confirmTwoFactor,
		isSuccess: isConfirmSuccessful,
		isPending: isConfirmPending,
	} = useMutation(
		api.query.miforge.accounts.twoFactor.confirm.mutationOptions(),
	);

	const formSetup = useForm<FormSetupValues>({
		resolver: zodResolver(FormSetupSchema),
		defaultValues: {
			recoveryKey: "",
		},
	});

	const formConfirm = useForm<FormConfirmValues>({
		resolver: zodResolver(FormConfirmSchema),
		defaultValues: {
			code: "",
		},
	});

	const handleSetupSubmit = useCallback(
		async (data: FormSetupValues) => {
			await withORPCErrorHandling(
				async () => {
					if (isSetupSuccessful) return;

					await setupTwoFactor({
						recoveryKey: data.recoveryKey,
					});
				},
				{
					onSuccess: () => {
						toast.success(
							"Two-Factor Authentication setup successful! Please confirm with your authenticator app.",
						);
					},
				},
			);
		},
		[setupTwoFactor, isSetupSuccessful],
	);

	const handleConfirmSubmit = useCallback(
		async (data: FormConfirmValues) => {
			withORPCErrorHandling(
				async () => {
					await confirmTwoFactor({
						token: data.code,
					});
				},
				{
					onSuccess: async () => {
						await queryClient.invalidateQueries({
							queryKey: api.query.miforge.accounts.details.queryKey(),
						});

						toast.success("Two-Factor Authentication linked successfully.");

						await new Promise((resolve) => setTimeout(resolve, 1000));

						navigate({
							to: "/account/details",
							replace: true,
						});
					},
				},
			);
		},
		[confirmTwoFactor, navigate, queryClient],
	);

	return (
		<>
			{!isSetupSuccessful && (
				<Container title="Setup Two-Factor Authentication">
					<Form {...formSetup}>
						<form onSubmit={formSetup.handleSubmit(handleSetupSubmit)}>
							<InnerContainer className="flex flex-col gap-2 p-2 text-secondary text-sm leading-tight">
								<span className="font-bold text-base text-error">
									Please read this warning carefully as it contains important
									security information! If you skip this message, you might lose
									your account!
								</span>
								<span>
									Before you connect your acccount with an authenticator app,
									you will be asked to enter your recovery key. If you do not
									have a valid recovery key, you need to order a new one before
									you can connect your account with an authenticator.
								</span>
								<span>Why?</span>
								<span>
									The recovery key is the only way to unlink the authenticator
									app from your account in various cases, among others, if:
								</span>
								<ul className="ml-5 hidden list-inside list-disc text-sm leading-tight md:block">
									<li>
										you lose your device (mobile phone, tablet etc.) with the
										authenticator app
									</li>
									<li>
										the device with the authenticator app does not work anymore
									</li>
									<li>the device with the authenticator app gets stolen</li>
									<li>
										you delete the authenticator app from your device and
										reinstall it
									</li>
									<li>your device is reset for some reason</li>
								</ul>
								<span>
									Please note that the authenticator app data is not saved on
									your device"s account (e.g. Google or iTunes sync) even if you
									have app data backup or synchronisation activated in the
									settings of your device!
								</span>
								<span>
									In all these scenarios, the recovery key is the only way to
									get access to your account. Note that not even customer
									support will be able to help you in these cases if you do not
									have a valid recovery key. For this reason, make sure to store
									your recovery key always in a safe place!
								</span>
								<span>
									Do you have a valid recovery key and would like to request the
									email with the confirmation key to start connecting your
									account to an authenticator app?
								</span>
							</InnerContainer>
							<InnerContainer>
								<div className="flex flex-col gap-1 p-1">
									<FormField
										control={formSetup.control}
										name="recoveryKey"
										render={({ field: { onChange, value, ...field } }) => {
											return (
												<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
													<FormLabel className="min-w-35">
														Recovery Key:
													</FormLabel>
													<div className="flex w-full flex-col">
														<FormControl>
															<Input
																{...field}
																placeholder="Recovery Key..."
																value={value}
																disabled={isSetupPending || isSetupSuccessful}
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
									{!isSetupSuccessful && (
										<ButtonImageLink variant="info" to="/">
											Back
										</ButtonImageLink>
									)}

									<ButtonImage
										variant="info"
										type="submit"
										disabled={isSetupPending || isSetupSuccessful}
										loading={isSetupPending}
									>
										Setup
									</ButtonImage>
								</div>
							</InnerContainer>
						</form>
					</Form>
				</Container>
			)}
			{isSetupSuccessful && (
				<Container title="Confirm Two-Factor Authentication">
					<Form {...formConfirm}>
						<form onSubmit={formConfirm.handleSubmit(handleConfirmSubmit)}>
							<InnerContainer>
								<div className="flex flex-col gap-1">
									<span className="font-semibold font-verdana text-lg text-secondary">
										Scan the QR code below with your authenticator app:
									</span>
									<QRCode
										value={setupData.uri}
										size={200}
										logo="/logo/icon-128.png"
									/>
								</div>
							</InnerContainer>
							<InnerContainer>
								<div className="flex flex-col gap-1 p-1">
									<FormField
										control={formConfirm.control}
										name="code"
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
																value={value}
																disabled={
																	isConfirmPending || isConfirmSuccessful
																}
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
									<ButtonImage
										variant="info"
										type="submit"
										disabled={isConfirmPending || isConfirmSuccessful}
										loading={isConfirmPending}
									>
										Link
									</ButtonImage>
								</div>
							</InnerContainer>
						</form>
					</Form>
				</Container>
			)}
		</>
	);
};
