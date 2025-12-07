import { useQuery } from "@tanstack/react-query";
import { api } from "@/sdk/lib/api/factory";
import { OutfitAnimation } from "../OutfitAnimation";

export const MonsterBoost = () => {
	const { data: outfits } = useQuery(
		api.query.miforge.outfit.list.queryOptions({
			input: {
				parameters: [
					{
						looktype: 1122,
						head: 94,
						body: 21,
						legs: 77,
						feet: 78,
						addons: 1,
						direction: 3,
					},
					{
						looktype: 1126,
						head: 94,
						body: 21,
						legs: 77,
						feet: 78,
						addons: 1,
						direction: 3,
					},
				],
			},
		}),
	);

	const firstMonsterBoostFrames = outfits?.outfits[0]?.frames ?? [];
	const secondMonsterBoostFrames = outfits?.outfits[1]?.frames ?? [];

	return (
		<div className="-top-[79px] absolute z-10 h-[85px] w-max self-center">
			<div className="relative">
				<img
					alt="monster-boots-pedestal"
					src="/assets/headers/pedestal.gif"
					className="z-10"
				/>

				<OutfitAnimation
					frames={firstMonsterBoostFrames ?? []}
					className="-top-3.5 absolute left-0 z-20"
					showNotFoundImage={false}
				/>
				<OutfitAnimation
					frames={secondMonsterBoostFrames ?? []}
					className="-top-3.5 absolute right-9 z-20"
					showNotFoundImage={false}
				/>
			</div>
		</div>
	);
};
