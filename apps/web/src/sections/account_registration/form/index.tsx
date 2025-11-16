import { zodResolver } from "@hookform/resolvers/zod";
import {
	COUNTRIES,
	COUNTRY_CODES,
	type CountryCode,
	getStatesByCountry,
	type StateCode,
} from "@miforge/core/geo";
import { ORPCError } from "@orpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { api } from "@/sdk/lib/api/factory";
import { cn } from "@/sdk/utils/cn";
import { Button } from "@/ui/Buttons/Button";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/ui/Command";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/Popover";
import { Tooltip } from "@/ui/Tooltip";

const FormSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	street: z.string().min(1, "Street is required"),
	number: z.string().min(1, "Number is required"),
	additional: z.string().optional(),
	postal: z.string().min(1, "Postal code is required"),
	city: z.string().min(1, "City is required"),
	country: z.enum(COUNTRY_CODES, {
		error: "Country is required",
	}),
	state: z.string().min(1, "State is required"),
	phone: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export const AccountRegistrationForm = () => {
	const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
	const [showRecoveryKeyDialog, setShowRecoveryKeyDialog] = useState(false);
	const [countryOpen, setCountryOpen] = useState(false);
	const [stateOpen, setStateOpen] = useState(false);
	const queryClient = useQueryClient();
	const { data, isLoading } = useQuery(
		api.query.miforge.accounts.details.queryOptions(),
	);
	const router = useRouter();
	const { mutateAsync: updateRegistration, isPending } = useMutation(
		api.query.miforge.accounts.registrationKey.mutationOptions(),
	);

	const hasRegistration = Boolean(data?.registration);

	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			firstName: data?.registration?.firstName || "",
			lastName: data?.registration?.lastName || "",
			street: data?.registration?.street || "",
			number: data?.registration?.number || "",
			additional: data?.registration?.additional || "",
			postal: data?.registration?.postal || "",
			city: data?.registration?.city || "",
			country: (data?.registration?.country as CountryCode) || "",
			state: data?.registration?.state || "",
			phone: data?.registration?.phone || "",
		},
	});

	useEffect(() => {
		if (data?.registration) {
			form.reset({
				firstName: data.registration.firstName || "",
				lastName: data.registration.lastName || "",
				street: data.registration.street || "",
				number: data.registration.number || "",
				additional: data.registration.additional || "",
				postal: data.registration.postal || "",
				city: data.registration.city || "",
				country: (data.registration.country as CountryCode) || "",
				state: data.registration.state || "",
				phone: data.registration.phone || "",
			});
		}
	}, [data, form]);

	const country = form.watch("country");

	const states = useMemo(() => {
		return getStatesByCountry(country);
	}, [country]);

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			try {
				const output = await updateRegistration({
					firstName: data.firstName,
					lastName: data.lastName,
					street: data.street,
					number: data.number,
					additional: data.additional ?? null,
					postal: data.postal,
					city: data.city,
					country: data.country,
					state: data.state as StateCode,
				});

				router.invalidate();

				queryClient.invalidateQueries(
					api.query.miforge.accounts.details.queryOptions(),
				);

				if (output.recoveryKey) {
					setShowRecoveryKeyDialog(true);
					setRecoveryKey(output.recoveryKey);

					return;
				}

				router.navigate({
					to: "/account/details",
					replace: true,
				});

				toast.success(
					hasRegistration
						? "Registration updated successfully."
						: "Account registered successfully.",
				);
			} catch (error) {
				if (error instanceof ORPCError) {
					return toast.error(`${error.message}`);
				}

				toast.error("An unexpected error occurred. Please try again.");
			}
		},
		[updateRegistration, router, hasRegistration, queryClient],
	);

	return (
		<Container
			title={hasRegistration ? "Update Registration" : "Register Account"}
		>
			<Dialog
				open={showRecoveryKeyDialog}
				onOpenChange={(open) => {
					if (!open) {
						setRecoveryKey(null);
						router.navigate({
							to: "/account/details",
							replace: true,
						});
					}
					setShowRecoveryKeyDialog(open);
				}}
			>
				<DialogContent title="Recovery Key">
					<InnerContainer>
						<DialogHeader>
							<DialogDescription>
								Please save your recovery key in a safe place. You will need it
								to recover your account if you forget your password. This is the
								only time you will be shown the recovery key.
							</DialogDescription>
						</DialogHeader>
					</InnerContainer>
					<InnerContainer className="mb-0">
						<DialogTitle className="break-all text-center font-mono text-lg text-secondary">
							{recoveryKey}
						</DialogTitle>
					</InnerContainer>
				</DialogContent>
			</Dialog>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer className="p-1">
						<div className="flex flex-col gap-3">
							<div className="flex flex-col gap-2">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
												<FormLabel className="min-w-25">First Name:</FormLabel>
												<div className="flex w-full flex-col">
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
												<FormLabel className="min-w-25">Last Name:</FormLabel>
												<div className="flex w-full flex-col">
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="street"
									render={({ field }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
												<FormLabel className="min-w-25">Street:</FormLabel>
												<div className="flex w-full flex-col">
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="number"
									render={({ field }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
												<FormLabel className="min-w-25">
													House Number:
												</FormLabel>
												<div className="flex w-full flex-col">
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="additional"
									render={({ field }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
												<FormLabel className="min-w-25">
													Additional Info:
												</FormLabel>
												<div className="flex w-full flex-col">
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
												<span className="text-secondary text-xs">
													(optional)
												</span>
												<Tooltip content="This field is optional">
													<img
														alt="info-optional-input"
														src="/assets/icons/global/info.gif"
														width={18}
														height={18}
													/>
												</Tooltip>
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="postal"
									render={({ field }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
												<FormLabel className="min-w-25">Postal Code:</FormLabel>
												<div className="flex w-full flex-col">
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="city"
									render={({ field }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
												<FormLabel className="min-w-25">City:</FormLabel>
												<div className="flex w-full flex-col">
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="country"
									render={({ field: { value, onChange } }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
												<FormLabel className="min-w-25">Country:</FormLabel>
												<div className="flex w-full flex-col">
													<FormControl>
														<Popover
															open={countryOpen}
															onOpenChange={setCountryOpen}
														>
															<PopoverTrigger asChild>
																<Button
																	variant="default"
																	role="combobox"
																	size="sm"
																	aria-expanded={countryOpen}
																	className="w-full justify-between md:w-[250px]"
																>
																	{value
																		? COUNTRIES.find(
																				(framework) => framework.code === value,
																			)?.name
																		: "Select country"}
																	<img
																		alt="up-and-down"
																		src="/assets/icons/global/icon-balance.png"
																		className="h-[11px] w-[11px] object-contain"
																	/>
																</Button>
															</PopoverTrigger>
															<PopoverContent className="w-[250px] p-0">
																<Command>
																	<CommandInput
																		placeholder="Search country..."
																		className="h-9"
																	/>
																	<CommandList>
																		<CommandEmpty>
																			No country found.
																		</CommandEmpty>
																		<CommandGroup>
																			{COUNTRIES.map((country) => (
																				<CommandItem
																					key={country.code}
																					value={country.name}
																					onSelect={() => {
																						const code = country.code;

																						onChange(
																							code === value ? "" : code,
																						);
																						form.resetField("state");
																						setCountryOpen(false);
																					}}
																				>
																					{country.name}
																					<img
																						alt="check-icon"
																						src="/assets/icons/global/true.png"
																						className={cn(
																							"ml-auto h-3 w-3 object-contain",
																							{
																								"opacity-100":
																									value === country.code,
																								"opacity-0":
																									value !== country.code,
																							},
																						)}
																					/>
																				</CommandItem>
																			))}
																		</CommandGroup>
																	</CommandList>
																</Command>
															</PopoverContent>
														</Popover>
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="state"
									render={({ field: { value, onChange } }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
												<FormLabel className="min-w-25">State:</FormLabel>
												<div className="flex w-full flex-col">
													<FormControl>
														<Popover
															open={stateOpen}
															onOpenChange={setStateOpen}
														>
															<PopoverTrigger asChild>
																<Button
																	variant="default"
																	role="combobox"
																	size="sm"
																	aria-expanded={stateOpen}
																	className="w-full justify-between md:w-[250px]"
																>
																	{value
																		? states.find(
																				(state) => state.code === value,
																			)?.name
																		: "Select State"}
																	<img
																		alt="up-and-down"
																		src="/assets/icons/global/icon-balance.png"
																		className="h-[11px] w-[11px] object-contain"
																	/>
																</Button>
															</PopoverTrigger>
															<PopoverContent className="w-[250px] p-0">
																<Command>
																	<CommandInput
																		placeholder="Search state..."
																		className="h-9"
																	/>
																	<CommandList>
																		<CommandEmpty>No state found.</CommandEmpty>
																		<CommandGroup>
																			{states.map((state) => (
																				<CommandItem
																					key={state.code}
																					value={state.name}
																					onSelect={() => {
																						const code = state.code;

																						onChange(
																							code === value ? "" : code,
																						);
																						setStateOpen(false);
																					}}
																				>
																					{state.name}
																					<img
																						alt="check-icon"
																						src="/assets/icons/global/true.png"
																						className={cn(
																							"ml-auto h-3 w-3 object-contain",
																							{
																								"opacity-100":
																									value === state.code,
																								"opacity-0":
																									value !== state.code,
																							},
																						)}
																					/>
																				</CommandItem>
																			))}
																		</CommandGroup>
																	</CommandList>
																</Command>
															</PopoverContent>
														</Popover>
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
											</FormItem>
										);
									}}
								/>
							</div>
						</div>
					</InnerContainer>
					<InnerContainer className="p-1">
						<div className="flex flex-row flex-wrap items-end justify-end gap-2">
							<ButtonImageLink
								variant="info"
								to="/account/details"
								hash="registration"
							>
								Back
							</ButtonImageLink>
							<ButtonImage
								variant="info"
								disabled={isLoading || isPending}
								loading={isLoading || isPending}
								type="submit"
							>
								{hasRegistration ? "Update" : "Register"}
							</ButtonImage>
						</div>
					</InnerContainer>
				</form>
			</Form>
		</Container>
	);
};
