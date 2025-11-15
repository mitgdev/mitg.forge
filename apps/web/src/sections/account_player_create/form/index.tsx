import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
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

const worlds: Array<{
	id: number;
	name: string;
	description?: string;
	new?: boolean;
	region: "eu" | "na" | "sa";
	pvpType: "open" | "optional" | "hardcore" | "retro";
}> = [
	{
		id: 1,
		name: "Ferumbra",
		description: "A vibrant world full of adventure.",
		new: true,
		region: "sa",
		pvpType: "open",
	},
	{
		id: 2,
		name: "Wadebra",
		region: "sa",
		description: "A world with optional PvP settings.",
		pvpType: "optional",
	},
	{
		id: 3,
		name: "Zanera",
		region: "na",
		description: "A classic retro PvP experience.",
		pvpType: "retro",
	},
	{
		id: 4,
		name: "Duskora",
		region: "eu",
		description: "For the bravest adventurers seeking hardcore PvP.",
		pvpType: "hardcore",
	},
];

const FormSchema = z.object({
	name: z
		.string({
			error: "Name is required",
		})
		.min(1, "Name is required"),
	sex: z.enum(["male", "female"]),
	vocation: z.enum(["sorcerer", "druid", "paladin", "knight", "monk"], {
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
	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			sex: "male",
			terms: false,
		},
	});

	const handleSubmit = useCallback(async (data: FormValues) => {
		console.log(data);
	}, []);

	const getPvpTypeIcon = (pvpType: string) => {
		switch (pvpType) {
			case "open":
				return "/assets/icons/global/option_server_pvp_type_open.gif";
			case "optional":
				return "/assets/icons/global/option_server_pvp_type_optional.gif";
			case "hardcore":
				return "/assets/icons/global/option_server_pvp_type_hardcore.gif";
			case "retro":
				return "/assets/icons/global/option_server_pvp_type_retro.gif";
			default:
				return "/assets/icons/global/option_server_pvp_type_open.gif";
		}
	};

	const getWorldIcon = (region: string) => {
		switch (region) {
			case "eu":
				return "/assets/icons/global/option_server_location_eur.png";
			case "na":
				return "/assets/icons/global/option_server_location_usa.png";
			case "sa":
				return "/assets/icons/global/option_server_location_bra.png";
			default:
				return "/assets/icons/global/option_server_location_all.png";
		}
	};

	return (
		<Container title="Create Character">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer>
						<div className="flex flex-col gap-1 md:flex-row">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5">
											<FormLabel>Name:</FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input {...field} className="max-w-sm" />
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
													<RadioGroupItem value="male" id="male" />
													<Label htmlFor="male">Male</Label>
												</div>
												<div className="flex items-center gap-2">
													<RadioGroupItem value="female" id="female" />
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
															onChange(world.id);
														}}
													>
														{world.new && (
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
																<img
																	alt="world-region"
																	src={getWorldIcon(world.region)}
																	className="h-12 w-12"
																/>
																<div className="-bottom-1 -left-1 absolute">
																	<Tooltip content={world.pvpType}>
																		<img
																			alt="world-type"
																			src={getPvpTypeIcon(world.pvpType)}
																			className="h-6 w-6 object-contain"
																		/>
																	</Tooltip>
																</div>
															</div>
															<div className="flex flex-col">
																<span className="text-start font-bold font-verdana text-lg text-secondary leading-tight">
																	{world.name}
																</span>
																<span className="text-start text-secondary text-xs leading-tight">
																	{world.description}
																</span>
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
									field: { value, onChange },
									formState: { defaultValues },
								}) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5">
											<RadioGroup
												defaultValue={defaultValues?.vocation}
												className="flex flex-row flex-wrap justify-around md:grid md:grid-cols-5"
												onValueChange={(value) => onChange(value)}
												value={value}
											>
												<div className="flex items-center gap-2 justify-self-center">
													<RadioGroupItem value="sorcerer" id="sorcerer" />
													<Label
														htmlFor="sorcerer"
														className="flex flex-col items-center gap-1"
													>
														<span className="text-secondary">Sorcerer</span>
														<img
															alt="vocation-sorcerer"
															src="/assets/vocations/sorcerer.png"
														/>
													</Label>
												</div>
												<div className="flex items-center gap-2 justify-self-center">
													<RadioGroupItem value="druid" id="druid" />
													<Label
														htmlFor="druid"
														className="flex flex-col items-center gap-1"
													>
														<span className="text-secondary">Druid</span>
														<img
															alt="vocation-druid"
															src="/assets/vocations/druid.png"
														/>
													</Label>
												</div>
												<div className="flex items-center gap-2 justify-self-center">
													<RadioGroupItem value="paladin" id="paladin" />
													<Label
														htmlFor="paladin"
														className="flex flex-col items-center gap-1"
													>
														<span className="text-secondary">Paladin</span>
														<img
															alt="vocation-paladin"
															src="/assets/vocations/paladin.png"
														/>
													</Label>
												</div>
												<div className="flex items-center gap-2 justify-self-center">
													<RadioGroupItem value="knight" id="knight" />
													<Label
														htmlFor="knight"
														className="flex flex-col items-center gap-1"
													>
														<span className="text-secondary">Knight</span>
														<img
															alt="vocation-knight"
															src="/assets/vocations/knight.png"
														/>
													</Label>
												</div>
												<div className="flex items-center gap-2 justify-self-center">
													<RadioGroupItem value="monk" id="monk" />
													<Label
														htmlFor="monk"
														className="flex flex-col items-center gap-1"
													>
														<span className="text-secondary">Monk</span>
														<img
															alt="vocation-monk"
															src="/assets/vocations/monk.png"
														/>
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
