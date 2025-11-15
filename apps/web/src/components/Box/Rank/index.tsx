import { Link } from "@tanstack/react-router";
import { useLocalStorage } from "usehooks-ts";
import { ThemeBox } from "@/components/Themebox";
import { cn } from "@/sdk/utils/cn";
import { Tooltip } from "@/ui/Tooltip";

const mockPlayers: Array<{
	name: string;
	level: number;
	experience: number;
	outfitUrl: string;
	vocation: string;
}> = [
	{
		name: "Kamity",
		level: Math.floor(Math.random() * 1500) + 100,
		experience: Math.floor(Math.random() * 99999999) + 1000,
		outfitUrl:
			"https://outfit-images.ots.me/latest_walk/animoutfit.php?id=1445&addons=3&head=114&body=114&legs=127&feet=108",
		vocation: "Elite Knight",
	},
	{
		name: "Leroy Jenkins",
		level: Math.floor(Math.random() * 1500) + 100,
		experience: Math.floor(Math.random() * 99999999) + 1000,
		outfitUrl:
			"https://outfit-images.ots.me/latest_walk/animoutfit.php?id=1444&addons=3&head=95&body=113&legs=39&feet=115",
		vocation: "Elite Knight",
	},
	{
		name: "Yeaerth",
		level: Math.floor(Math.random() * 1500) + 100,
		experience: Math.floor(Math.random() * 99999999) + 1000,
		outfitUrl:
			"https://outfit-images.ots.me/latest_walk/animoutfit.php?id=130&addons=3&head=0&body=114&legs=94&feet=94",
		vocation: "Elite Knight",
	},
	{
		name: "Kamity",
		level: Math.floor(Math.random() * 1500) + 100,
		experience: Math.floor(Math.random() * 99999999) + 1000,
		outfitUrl:
			"https://outfit-images.ots.me/latest_walk/animoutfit.php?id=130&head=114&body=114&legs=0&feet=127",
		vocation: "Elite Knight",
	},
	{
		name: "Liker",
		level: Math.floor(Math.random() * 1500) + 100,
		experience: Math.floor(Math.random() * 99999999) + 1000,
		outfitUrl:
			"https://outfit-images.ots.me/latest_walk/animoutfit.php?id=128&addons=3&head=79&body=114&legs=89&feet=78",
		vocation: "Elite Knight",
	},
];

export const RankBox = () => {
	const [mode, setMode] = useLocalStorage<"level" | "experience">(
		"miforge:rank-box-mode",
		"experience",
	);

	return (
		<ThemeBox
			title={`Rank (${mode === "level" ? "Lvl" : "Xp"})`}
			icon="journal"
		>
			<button
				onClick={() => {
					if (mode === "level") {
						setMode("experience");
					} else {
						setMode("level");
					}
				}}
				type="button"
				className="-right-4 -bottom-4 absolute h-8 w-8 cursor-pointer rounded-3xl border border-tertiary bg-tibia-600 p-1"
			>
				<img
					alt="test"
					className="shadow-2xl"
					src={
						mode === "experience"
							? "/assets/icons/global/medals.png"
							: "/assets/icons/64/xp_boost.png"
					}
				/>
			</button>
			<div className="m-1 border border-tertiary bg-tibia-500">
				{mockPlayers
					.sort((a, b) => {
						if (mode === "experience") {
							return b.experience - a.experience;
						}

						return b.level - a.level;
					})
					.map((player, index) => {
						const last = mockPlayers.length - 1;

						return (
							<Link
								to="/"
								className={cn(
									"relative flex flex-row items-center gap-2 border-tertiary border-b",
									{
										"border-0": index === last,
									},
								)}
								key={`${index}-${player.name}`}
							>
								<Tooltip content={`Rank ${index + 1}`}>
									<div className="-bottom-1.5 absolute right-0">
										<img
											src={`/assets/icons/highscores/rank${index + 1}.png`}
											alt={`rank ${index + 1}-${player.name}`}
											className="h-[38px] w-[19px]"
										/>
									</div>
								</Tooltip>

								<div className="h-12 w-8 min-w-8">
									<img
										src={player.outfitUrl}
										alt="outfit"
										className="-left-8 absolute bottom-1.5 h-16 w-16"
									/>
								</div>
								<div className="flex flex-col">
									<span className="max-w-[110px] overflow-hidden truncate font-bold font-verdana text-quaternary text-xs">
										{index + 1}. {player.name}
									</span>
									{mode === "level" && (
										<>
											<span className="text-xxs">Level: {player.level}</span>
											<span className="text-xxs">{player.vocation}</span>
										</>
									)}
									{mode === "experience" && (
										<span className="font-bold text-tertiary text-xs">
											Exp: {player.experience.toLocaleString()}
										</span>
									)}
								</div>
							</Link>
						);
					})}
			</div>
		</ThemeBox>
	);
};
