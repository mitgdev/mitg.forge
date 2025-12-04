import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "@/sdk/lib/api/factory";
import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";

export const Information = () => {
	const { data: worlds } = useQuery(
		api.query.miforge.worlds.list.queryOptions(),
	);

	const onlinePlayers = (worlds ?? []).reduce(
		(acc, world) => acc + world.status.players.online,
		0,
	);

	const hasAnyWorldOnline = (worlds ?? []).some(
		(world) => world.status.uptime > 0,
	);

	return (
		<Section>
			<SectionHeader color="red">
				<div className="flex h-full w-full justify-between gap-1">
					<div className="flex items-center justify-end gap-2 md:gap-4">
						<a
							href="https://discord.gg/mitg"
							target="_blank"
							className="flex flex-row items-center gap-1 font-verdana text-white text-xxs hover:underline"
							rel="noopener"
						>
							<img src="/assets/icons/16/icon-discord.png" alt="discord" />
							<span>Discord</span>
						</a>
						<a
							href="/#instagram"
							target="_blank"
							className="flex flex-row items-center gap-1 font-verdana text-white text-xxs hover:underline"
							rel="noopener"
						>
							<img src="/assets/icons/16/icon-instagram.png" alt="instagram" />
							<span>Instagram</span>
						</a>
						<Link
							to="/"
							className="hidden flex-row items-center gap-1 font-verdana text-white text-xxs hover:underline lg:flex"
						>
							<img src="/assets/icons/16/icon-download.png" alt="download" />
							<span>Download</span>
						</Link>
					</div>
					<Link
						to="/worlds"
						className="flex flex-row items-center justify-end gap-2 font-verdana text-white text-xxs hover:underline"
					>
						<img
							src="/assets/icons/global/icon-players-online.png"
							alt="players online"
						/>
						{hasAnyWorldOnline ? (
							<span>{onlinePlayers} Players online</span>
						) : (
							<span className="">Offline</span>
						)}
					</Link>
				</div>
			</SectionHeader>
		</Section>
	);
};
