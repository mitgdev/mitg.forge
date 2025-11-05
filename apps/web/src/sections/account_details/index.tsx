import { useQuery } from "@tanstack/react-query";
import { useTimezone } from "@/sdk/hooks/useTimezone";
import { api } from "@/sdk/lib/api/factory";
import { cn } from "@/sdk/utils/cn";
import { ButtonLink } from "@/ui/Buttons/ButtonLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { Tooltip } from "@/ui/Tooltip";

export const AccountDetailsSection = () => {
	const { data } = useQuery(api.query.miforge.accounts.details.queryOptions());
	const { formatDate } = useTimezone();

	if (!data) {
		/**
		 * TODO: Handle loading state
		 */
		return null;
	}

	const isPremium = data?.premdays > 0;

	return (
		<Section>
			<SectionHeader color="green">
				<h1 className="section-title">Account Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<Container title="General Information">
					<InnerContainer className="p-0">
						<List
							items={[
								{
									title: "Email Address",
									value: (
										<span className="font-verdana text-secondary text-sm">
											{data?.email}
										</span>
									),
								},
								{
									title: "Created",
									value: (
										<span className="font-verdana text-secondary text-sm">
											{formatDate(data.creation)}
										</span>
									),
								},
								{
									title: "Account Status",
									value: (
										<span
											className={cn("font-bold font-verdana text-sm", {
												"text-success": isPremium,
												"text-error": !isPremium,
											})}
										>
											{isPremium ? "VIP Account" : "Free Account"}
										</span>
									),
								},
								{
									title: "Tibia Coins",
									value: (
										<div className="flex flex-row flex-wrap items-center gap-2">
											<div className="flex flex-row items-center gap-0.5">
												<span className="font-verdana text-secondary text-sm">
													{data.coins_transferable}
												</span>
												<Tooltip content="Transferable coins">
													<img
														alt="tibia coins"
														src="/assets/icons/global/icon-tibiacoin.png"
														width={12}
														height={12}
													/>
												</Tooltip>
											</div>
											<div className="flex flex-row items-center gap-0.5 font-verdana text-secondary text-sm">
												(Including: {data.coins}{" "}
												<Tooltip content="Non-transferable coins">
													<img
														alt="tibia coins"
														src="/assets/icons/global/icon-tibiacointrusted.png"
														width={12}
														height={12}
													/>
												</Tooltip>
												)
											</div>
											<Tooltip content="Transferable coins can be used in the Tibia Store and traded with other players.">
												<img
													alt="coins info"
													src="/assets/icons/global/info.gif"
												/>
											</Tooltip>
										</div>
									),
								},
								{
									title: "Loyalty Points",
									value: (
										<span className="font-verdana text-secondary text-sm">
											0
										</span>
									),
								},
								{
									title: "Loyalty Title",
									value: (
										<span className="font-verdana text-secondary text-sm">
											Scout of RubinOT (Promotion to: Sentinel of RubinOT at 1
											Loyalty Points)
										</span>
									),
								},
							]}
						/>
					</InnerContainer>
					<div className="flex flex-row flex-wrap justify-end gap-1">
						<ButtonLink variant="red" to="/">
							Terminate Account
						</ButtonLink>
						<ButtonLink variant="info" to="/">
							Change Password
						</ButtonLink>
						<ButtonLink variant="info" to="/">
							Change Email
						</ButtonLink>
					</div>
				</Container>
			</InnerSection>
		</Section>
	);
};

type ListItemProps = {
	title: string;
	value: string | number | React.ReactNode;
};

export const List = ({ items }: { items: ListItemProps[] }) => {
	return (
		<div>
			{items.map((item, index) => {
				const isOdd = index % 2 === 1;

				return (
					<div
						key={`account-details-list-item-${item.title}`}
						className={cn("border-septenary border-t", {
							"bg-tibia-900": isOdd,
							"bg-tibia-600": !isOdd,
							// add border only between items, not on the first one
							"border-t-0": index === 0,
						})}
					>
						<div className="grid grid-cols-[minmax(90px,200px)_minmax(0,1fr)] items-center">
							<div className="border-septenary border-r px-2">
								<span className="font-bold font-verdana text-secondary text-sm">
									{item.title}:
								</span>
							</div>
							<div className="px-2">{item.value}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
