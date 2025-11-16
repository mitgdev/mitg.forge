import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PlayerStatusHidden } from "@/components/Player/Hidden";
import { PlayerMain } from "@/components/Player/Main";
import { PlayerIsOnline } from "@/components/Player/Online";
import { PlayerRewardCollected } from "@/components/Player/RewardCollected";
import { PlayerRole } from "@/components/Player/Role";
import { PlayerVocation } from "@/components/Player/Vocation";
import { api } from "@/sdk/lib/api/factory";
import { makeOutfit } from "@/sdk/utils/outfit";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

/**
 * TODO: The limit of possible characters per account will be bellow of 99.
 * This should't be a problem, but wee can make a better implementation of this.
 * Using a config value from env or something similar.
 *
 * TODO: Remembering that query is been prefetched on route loader. In the future, maybe implement
 * a skeleton to simulate a loading state while data is been fetched.
 */
export const AccountCharacters = () => {
	const { data } = useQuery(
		api.query.miforge.accounts.characters.list.queryOptions({
			input: {
				page: 1,
				limit: 99,
			},
		}),
	);

	const characters = data?.results ?? [];

	return (
		<Container title="Characters">
			<InnerContainer className="flex justify-center p-0">
				<span className="font-bold text-secondary">Regular Characters</span>
			</InnerContainer>
			<InnerContainer className="p-0">
				<table className="w-full border-collapse">
					<thead>
						<tr>
							<th className="w-[2%] border border-septenary p-1 text-start font-bold text-secondary" />
							<th className="border border-septenary p-1 text-start font-bold text-secondary">
								Name
							</th>
							<th className="hidden w-[10%] border border-septenary p-1 text-start font-bold text-secondary md:table-cell">
								Vocation
							</th>
							<th className="hidden w-[10%] border border-septenary p-1 text-start font-bold text-secondary md:table-cell">
								Status
							</th>
							<th className="w-[10%] border border-septenary p-1 text-start font-bold text-secondary">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{characters.map((character, index) => {
							return (
								<tr key={`${character.id}-${character.name}`}>
									<td className="border border-septenary p-1 text-center">
										<span className="font-bold text-secondary">
											{index + 1}.
										</span>
									</td>
									<td className="border border-septenary p-1 text-secondary">
										<div className="flex flex-row flex-wrap items-center gap-1">
											<div className="relative hidden h-16 w-16 md:block">
												<img
													alt="character-avatar"
													src={makeOutfit({
														id: character.looktype,
														addons: character.lookaddons,
														head: character.lookhead,
														body: character.lookbody,
														legs: character.looklegs,
														feet: character.lookfeet,
													})}
													className="absolute right-3 bottom-3"
												/>
											</div>
											<div className="flex flex-col">
												<div className="flex flex-row items-center gap-1">
													<PlayerRole role={character.group_id} />
													<span className="font-bold text-lg text-secondary">
														{character.name}
													</span>
													{character.ismain && <PlayerMain />}
												</div>

												<span className="flex flex-row items-center gap-1 text-secondary text-xs">
													Level {character.level} - on Ferumbra
												</span>
											</div>
										</div>
									</td>
									<td className="hidden border border-septenary p-1 md:table-cell">
										<div className="flex w-full justify-center">
											<PlayerVocation vocation={character.vocation} />
										</div>
									</td>
									<td className="hidden border border-septenary p-1 text-secondary md:table-cell">
										<div className="flex flex-row flex-wrap items-center justify-center gap-1">
											<PlayerRewardCollected
												collected={character.daily_reward_collected}
											/>
											<PlayerIsOnline online={character.online} />
											{character.ishidden && <PlayerStatusHidden />}
										</div>
									</td>
									<td className="border border-septenary p-1">
										<div className="flex flex-col items-center">
											<span className="text-secondary text-sm">
												[
												<Link
													to="/"
													className="font-bold text-blue-900 underline"
												>
													Edit
												</Link>
												]
											</span>
											<span className="text-secondary text-sm">
												[
												<Link
													to="/"
													className="font-bold text-blue-900 underline"
												>
													Delete
												</Link>
												]
											</span>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</InnerContainer>
			<div className="flex w-full flex-wrap justify-end gap-2">
				<ButtonImageLink variant="green" to="/">
					Change Main
				</ButtonImageLink>
				<ButtonImageLink variant="info" to="/account/player/create">
					Create Character
				</ButtonImageLink>
			</div>
		</Container>
	);
};
