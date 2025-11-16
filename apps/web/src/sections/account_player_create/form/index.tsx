import { zodResolver } from "@hookform/resolvers/zod";
import { ORPCError } from "@orpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { PlayerVocation } from "@/components/Player/Vocation";
import { PvpTypeIcon } from "@/components/PvpType";
import { RegionIcon } from "@/components/Region";
import { api } from "@/sdk/lib/api/factory";
import { cn } from "@/sdk/utils/cn";
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
import { RadioGroup, RadioGroupItem } from "@/ui/RadioGroup";
import { Tooltip } from "@/ui/Tooltip";

const FormSchema = z.object({
	name: z
		.string({
			error: "Name is required",
		})
		.min(4, "Name must be at least 4 characters")
		.max(21, "Name must be at most 21 characters")
		.refine((val) => {
			const nameRegex = /^[A-Za-z][A-Za-z0-9 ]*$/;
			return nameRegex.test(val);
		}, "Name can only contain letters, numbers, and spaces, and must start with a letter"),
	sex: z.enum(["Male", "Female"]),
	vocation: z.enum(["Sorcerer", "Druid", "Paladin", "Knight", "Monk"], {
		error: "Vocation selection is required",
	}),
	worldId: z.number({
		error: "World selection is required",
	}),
	terms: z
		.boolean({
			error: "You must accept the terms and conditions",
		})
		.refine((val) => val === true, {
			message: "You must accept the terms and conditions",
		}),
});

type FormValues = z.infer<typeof FormSchema>;

export const AccountPlayerCreateForm = () => {
	const { data: worlds = [] } = useQuery(
		api.query.miforge.worlds.list.queryOptions(),
	);
	const { mutateAsync } = useMutation(
		api.query.miforge.accounts.characters.create.mutationOptions(),
	);
	const queryClient = useQueryClient();
	const router = useRouter();

	const mostRecentCreated = useMemo(() => {
		const orderedWorlds = [...worlds].sort((a, b) => {
			return b.created_at.getTime() - a.created_at.getTime();
		});

		return orderedWorlds[0] || null;
	}, [worlds]);

	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: "",
			sex: "Male",
			terms: false,
		},
	});

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			try {
				await mutateAsync({
					gender: data.sex,
					name: data.name,
					vocation: data.vocation,
					worldId: data.worldId,
				});

				queryClient.invalidateQueries(
					api.query.miforge.accounts.characters.list.queryOptions({
						input: {},
					}),
				);

				router.navigate({
					to: "/account",
					replace: true,
				});

				toast.success("Character created successfully!");
			} catch (error) {
				if (error instanceof ORPCError) {
					if (error.status === 409) {
						form.setError("name", {
							type: "custom",
							message: error.message,
						});
					}

					return toast.error(`${error.message}`);
				}

				toast.error("An unexpected error occurred. Please try again.");
			}
		},
		[mutateAsync, queryClient, router, form.setError],
	);

	return (
		<Container title="Create Character">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer>
						<div className="flex flex-col gap-1 md:flex-row">
							<FormField
								control={form.control}
								name="name"
								render={({ field: { onChange, value, ...field } }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5">
											<FormLabel>Name:</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input
														{...field}
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
								name="sex"
								render={({
									field: { value, onChange },
									formState: { defaultValues },
								}) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5">
											<FormLabel>Sex:</FormLabel>
											<RadioGroup
												defaultValue={defaultValues?.sex}
												className="flex-1 gap-0.5"
												onValueChange={(value) => onChange(value)}
												value={value}
											>
												<div className="flex items-center gap-2">
													<RadioGroupItem value="Male" id="male" />
													<Label htmlFor="male">Male</Label>
												</div>
												<div className="flex items-center gap-2">
													<RadioGroupItem value="Female" id="female" />
													<Label htmlFor="female">Female</Label>
												</div>
											</RadioGroup>
										</FormItem>
									);
								}}
							/>
						</div>
					</InnerContainer>
					<InnerContainer>
						<FormField
							control={form.control}
							name="worldId"
							render={({ field: { value, onChange } }) => {
								return (
									<FormItem>
										<div className="grid grid-cols-1 gap-1 p-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
											{worlds.map((world) => {
												const selected = value === world.id;
												const mostRecent = world.id === mostRecentCreated?.id;

												return (
													<button
														type="button"
														className={cn(
															"relative border border-quaternary bg-tibia-500 px-2 py-2 shadow-container transition-all hover:cursor-pointer hover:bg-tibia-800",
															{
																"bg-tibia-800": selected,
															},
														)}
														key={world.id}
														onClick={() => {
															const alreadySelected = value === world.id;
															if (alreadySelected) {
																onChange(undefined);
																return;
															}
															onChange(world.id);
														}}
													>
														{mostRecent && (
															<div className="absolute top-0 left-0">
																<Tooltip content="New Server">
																	<img
																		alt="new server"
																		src="/assets/icons/global/button-store-new.png"
																	/>
																</Tooltip>
															</div>
														)}

														<div className="flex flex-row gap-1">
															<div className="relative flex h-12 min-h-12 w-12 min-w-12">
																<RegionIcon region={world.location} />
																<div className="-bottom-1 -left-1 absolute">
																	<PvpTypeIcon type={world.type} />
																</div>
															</div>
															<div className="flex flex-col">
																<span className="text-start font-bold font-verdana text-lg text-secondary leading-tight">
																	{world.name}
																</span>
																{/**
																 * TODO: Add real description from the API
																 */}
																{/* <span className="text-start text-secondary text-xs leading-tight">
																	Description
																</span> */}
															</div>
														</div>

														<div
															className={cn(
																"absolute right-0.5 bottom-0.5 transition-all",
																{
																	"opacity-0": !selected,
																},
															)}
														>
															<img
																alt="selected-icon"
																src="/assets/icons/global/true.png"
															/>
														</div>
													</button>
												);
											})}
										</div>
										<FormMessage className="text-red-500" />
									</FormItem>
								);
							}}
						/>
					</InnerContainer>
					<InnerContainer>
						<div className="flex flex-col gap-1 md:flex-row">
							<FormField
								control={form.control}
								name="vocation"
								render={({
									field: { onChange },
									formState: { defaultValues },
								}) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5">
											<RadioGroup
												defaultValue={defaultValues?.vocation}
												className="flex flex-row flex-wrap justify-around md:grid md:grid-cols-5"
												onValueChange={(value) => onChange(value)}
											>
												<div className="flex items-center gap-2 justify-self-center">
													<RadioGroupItem value="Sorcerer" id="sorcerer" />
													<Label
														htmlFor="sorcerer"
														className="flex flex-col items-center gap-1"
													>
														<span className="text-secondary">Sorcerer</span>
														<PlayerVocation vocation="Sorcerer" />
													</Label>
												</div>
												<div className="flex items-center gap-2 justify-self-center">
													<RadioGroupItem value="Druid" id="druid" />
													<Label
														htmlFor="druid"
														className="flex flex-col items-center gap-1"
													>
														<span className="text-secondary">Druid</span>
														<PlayerVocation vocation="Druid" />
													</Label>
												</div>
												<div className="flex items-center gap-2 justify-self-center">
													<RadioGroupItem value="Paladin" id="paladin" />
													<Label
														htmlFor="paladin"
														className="flex flex-col items-center gap-1"
													>
														<span className="text-secondary">Paladin</span>
														<PlayerVocation vocation="Paladin" />
													</Label>
												</div>
												<div className="flex items-center gap-2 justify-self-center">
													<RadioGroupItem value="Knight" id="knight" />
													<Label
														htmlFor="knight"
														className="flex flex-col items-center gap-1"
													>
														<span className="text-secondary">Knight</span>
														<PlayerVocation vocation="Knight" />
													</Label>
												</div>
												<div className="flex items-center gap-2 justify-self-center">
													<RadioGroupItem value="Monk" id="monk" />
													<Label
														htmlFor="monk"
														className="flex flex-col items-center gap-1"
													>
														<span className="text-secondary">Monk</span>
														<PlayerVocation vocation="Monk" />
													</Label>
												</div>
											</RadioGroup>
											<FormMessage className="text-red-500" />
										</FormItem>
									);
								}}
							/>
						</div>
					</InnerContainer>
					<InnerContainer>
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
												<div>
													I agree to the{" "}
													<Link
														to="/"
														className="font-bolder text-blue-800 hover:underline"
													>
														Privacy
													</Link>{" "}
													Terms and the{" "}
													<Link
														to="/"
														className="font-bolder text-blue-800 hover:underline"
													>
														Rules
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
					</InnerContainer>
					<InnerContainer>
						<div className="flex flex-row flex-wrap items-end justify-end gap-2">
							<ButtonImageLink
								variant="info"
								to="/account/details"
								hash="registration"
							>
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
