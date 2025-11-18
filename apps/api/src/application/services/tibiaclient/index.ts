import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import type { HasherCrypto } from "@/domain/modules";
import type { AccountRepository } from "@/domain/repositories";
import type { WorldsRepository } from "@/domain/repositories/worlds";
import { TOKENS } from "@/infra/di/tokens";
import type { TibiaClientCharacter } from "@/shared/schemas/ClientCharacters";
import type { TibiaClientError } from "@/shared/schemas/ClientError";
import type { TibiaClientSession } from "@/shared/schemas/ClientSession";
import type { TibiaClientWorld } from "@/shared/schemas/ClientWorld";
import { getPvpTypeId } from "@/shared/utils/game/pvpType";
import { getVocationName } from "@/shared/utils/player";

@injectable()
export class TibiaClientService {
	constructor(
		@inject(TOKENS.HasherCrypto)
		private readonly hasherCrypto: HasherCrypto,
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
		@inject(TOKENS.WorldsRepository)
		private readonly worldsRepository: WorldsRepository,
	) {}

	async login(
		email: string,
		password: string,
	): Promise<
		| TibiaClientError
		| {
				session: TibiaClientSession;
				playdata: {
					worlds: Array<TibiaClientWorld>;
					characters: Array<TibiaClientCharacter>;
				};
		  }
	> {
		try {
			const account = await this.accountRepository.findByEmail(email);

			// 3 error common
			// 6 Two-factor by app/token
			// 7 Client is too old
			// 8 Two-factor by email
			// 11 Suspicious login, code sent to email
			// return {
			// 	errorCode: 3,
			// 	errorMessage: "Invalid email or password",
			// };
			if (!account) {
				return {
					errorCode: 3,
					errorMessage: "Invalid email or password",
				};
			}

			const isPasswordValid = this.hasherCrypto.compare(
				password,
				account.password,
			);

			if (!isPasswordValid) {
				return {
					errorCode: 3,
					errorMessage: "Invalid email or password",
				};
			}

			const characters = await this.accountRepository.characters(account.id);
			const worlds = await this.worldsRepository.findAll();

			return {
				session: {
					sessionkey: `${account.email}\n${password}`,
					lastlogintime: account.lastday,
					ispremium: true, // TODO: implement premium time
					premiumuntil: 0, // TODO: implement premium time
					status: "active", // TODO: implement status (active, blocked, deleted)
					returnernotification: false, // show a notification to get a free boost and 7 days of premium
					showrewardnews: true,
					isreturner: false,
					fpstracking: true,
					optiontracking: true,
					tournamentticketpurchasestate: 0,
					emailcoderequest: false,
				},
				playdata: {
					worlds: worlds.map((world) => {
						return {
							id: world.id,
							name: world.name, // Same as config.lua
							externaladdress: world.ip,
							externaladdressprotected: world.ip,
							externaladdressunprotected: world.ip,
							externalport: world.port,
							externalportprotected: world.port,
							externalportunprotected: world.port,
							previewstate: 0, // if is experimental 0 = ok | 1 = experimental
							location: world.location,
							anticheatprotection: false,
							pvptype: getPvpTypeId(world.type),
							istournamentworld: false,
							restrictedstore: false,
							currenttournamentphase: 2,
						};
					}),
					characters: characters.map((char) => {
						return {
							worldid: worlds[0].id, // TODO: When multiple worlds is available, retrieve worldId from the character
							name: char.name,
							ismale: char.sex === 1,
							tutorial: char.istutorial === 1,
							level: char.level,
							vocation: getVocationName(char.vocation),
							outfitid: char.looktype,
							headcolor: char.lookhead,
							torsocolor: char.lookbody,
							legscolor: char.looklegs,
							detailcolor: char.lookfeet,
							addonsflags: char.lookaddons,
							ishidden: char.ishidden,
							istournamentparticipant: false,
							ismaincharacter: char.ismain,
							dailyrewardstate: char.isreward, // 0 = not claimed | 1 = claimed
							remainingdailytournamentplaytime: false,
						};
					}),
				},
			};
		} catch (error) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: (error as Error).message,
			});
		}
	}
}
