import { DiscordBox } from "@/components/Box/Discord";
import { RankBox } from "@/components/Box/Rank";
import { MonsterBoost } from "@/components/MonsterBoost";

export const Sidebar = () => {
	return (
		<aside
			className="relative hidden w-max flex-col gap-3 xl:flex"
			style={{
				gridArea: "sidebar",
			}}
		>
			<MonsterBoost />
			<RankBox />
			<DiscordBox />
		</aside>
	);
};
