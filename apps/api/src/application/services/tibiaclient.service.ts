import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import type { HasherCrypto } from "@/domain/modules/crypto/hasher";
import type { AccountRepository } from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import type { TibiaClientCharacter } from "@/shared/schemas/ClientCharacters";
import type { TibiaClientError } from "@/shared/schemas/ClientError";
import type { TibiaClientSession } from "@/shared/schemas/ClientSession";
import type { TibiaClientWorld } from "@/shared/schemas/ClientWorld";
import { getVocationName } from "@/utils/player";

@injectable()
export class TibiaClientService {
	constructor(
		@inject(TOKENS.HasherCrypto)
		private readonly hasherCrypto: HasherCrypto,
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
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

			return {
				session: {
					sessionkey: `${account.email}\n${password}`,
					lastlogintime: account.lastday,
					ispremium: false,
					premiumuntil: 0,
					status: "active",
					returnernotification: false,
					showrewardnews: true,
					isreturner: false,
					fpstracking: true,
					optiontracking: true,
					tournamentticketpurchasestate: 0,
					emailcoderequest: false,
				},
				playdata: {
					worlds: [
						{
							id: 0,
							name: "Crystal", // Same as config.lua
							externaladdress: "10.1.1.251",
							externaladdressprotected: "10.1.1.251",
							externaladdressunprotected: "10.1.1.251",
							externalport: 7172,
							externalportprotected: 7172,
							externalportunprotected: 7172,
							previewstate: 0, // if is experimental 0 = ok | 1 = experimental
							location: "BRA",
							anticheatprotection: false,
							pvptype: 0, // 0 = open | 1 = optional | 2 = hardcore
							istournamentworld: false,
							restrictedstore: false,
							currenttournamentphase: 2,
						},
					],
					characters: characters.map((char) => {
						return {
							worldid: 0,
							name: char.name,
							ismale: char.sex === 1,
							tutorial: char.istutorial,
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
