import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PvpTypeIcon } from "@/components/PvpType";
import { RegionIcon } from "@/components/Region";
import { api } from "@/sdk/lib/api/factory";
import { cn } from "@/sdk/utils/cn";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";

const calculateUptime = (uptimeInSeconds: number) => {
	const days = Math.floor(uptimeInSeconds / 86400);
	const hours = Math.floor((uptimeInSeconds % 86400) / 3600);
	const minutes = Math.floor((uptimeInSeconds % 3600) / 60);

	return `${days}d ${hours}h ${minutes}m`;
};

export const WorldsSection = () => {
	const { data } = useQuery(api.query.miforge.worlds.list.queryOptions());

	const worlds = data ?? [];

	const overallMaximum = worlds.reduce((acc, world) => {
		return acc + world.status.players.record;
	}, 0);

	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Worlds</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<Container title="Game World Overview">
					<InnerContainer className="flex flex-row gap-2">
						<span className="font-bold text-secondary text-sm">
							Overall Maximum:
						</span>
						<span className="text-secondary text-sm">{overallMaximum}</span>
					</InnerContainer>
					<InnerContainer className="p-0">
						<div className="flex w-full justify-center">
							<span className="font-bold text-secondary">Regular Worlds</span>
						</div>
					</InnerContainer>
					<InnerContainer className="border-none p-0">
						<table className="w-full border-collapse">
							<thead>
								<tr>
									<th className="border border-septenary px-1 text-start font-bold text-secondary">
										World
									</th>
									<th className="border border-septenary px-1 text-center font-bold text-secondary md:table-cell md:w-[10%]">
										Online
									</th>
									<th className="border border-septenary px-1 text-center font-bold text-secondary md:table-cell">
										Location
									</th>
									<th className="border border-septenary px-1 text-center font-bold text-secondary md:table-cell">
										PvP Type
									</th>
									<th className="hidden border border-septenary px-1 text-center font-bold text-secondary md:table-cell">
										Uptime
									</th>
								</tr>
							</thead>
							<tbody>
								{worlds.map((world, index) => {
									const isOdd = index % 2 === 1;

									const isOnline =
										world.status.players.online > 0 && world.status.uptime > 0;

									return (
										<tr
											key={`${world.id}-${world.name}`}
											className={cn({
												"bg-tibia-900": !isOdd,
												"bg-tibia-600": isOdd,
											})}
										>
											<td className="border border-septenary p-1 text-start md:py-0.5">
												<Link
													className="font-bold text-blue-800 transition-all hover:text-blue-600 hover:underline"
													to="/"
												>
													<div className="flex flex-row items-center gap-1">
														<span className="text-sm">{world.name}</span>
													</div>
												</Link>
											</td>
											<td className="border border-septenary p-1 text-center md:py-0.5">
												{isOnline ? (
													<span className="text-secondary text-sm">
														{world.status.players.online}
													</span>
												) : (
													<span className="text-error text-sm">Offline</span>
												)}
											</td>
											<td className="border border-septenary p-1 text-center md:py-0.5">
												<div className="flex justify-center">
													<RegionIcon
														region={world.location}
														className="h-6 w-6"
													/>
												</div>
											</td>
											<td className="border border-septenary p-1 text-center md:py-0.5">
												<div className="flex justify-center">
													<PvpTypeIcon type={world.type} className="h-6 w-6" />
												</div>
											</td>
											<td className="hidden border border-septenary p-1 text-center md:table-cell md:py-0.5">
												<span className="text-secondary text-sm">
													{calculateUptime(world.status.uptime)}
												</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</InnerContainer>
				</Container>
			</InnerSection>
		</Section>
	);
};
