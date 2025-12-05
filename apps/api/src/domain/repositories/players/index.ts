import type { player_items, players } from "generated/client";
import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";
import { dateToUnixTimestamp } from "@/shared/utils/date";

@injectable()
export class PlayersRepository {
	constructor(@inject(TOKENS.Prisma) private readonly prisma: Prisma) {}

	async editByName(name: string, data: Partial<players>) {
		return this.prisma.players.update({
			where: {
				name,
			},
			data,
		});
	}

	async scheduleToDeleteByName(name: string, deleteAt?: Date) {
		return this.prisma.players.update({
			where: {
				name,
			},
			data: {
				// When deleteAt is undefined, set deletion to 0 (no deletion)
				deletion: deleteAt ? dateToUnixTimestamp(deleteAt) : 0,
			},
		});
	}

	async byName(name: string) {
		return this.prisma.players.findUnique({
			where: {
				name,
			},
		});
	}

	async items(playerId: number) {
		return this.prisma.player_items.findMany({
			where: {
				player_id: playerId,
			},
		});
	}

	async create(
		accountId: number,
		data: Omit<players, "id" | "account_id">,
		initialItems: player_items[] = [],
	) {
		return this.prisma.players.create({
			data: {
				account_id: accountId,
				...data,
				player_items: {
					create: initialItems,
				},
			},
		});
	}

	async isOnline(playerId: number) {
		const player = await this.prisma.players_online.findUnique({
			where: {
				player_id: playerId,
			},
		});

		return !!player;
	}

	async allCharactersWithOnlineStatus(accountId: number) {
		const characters = await this.prisma.players.findMany({
			where: {
				account_id: accountId,
			},
			orderBy: {
				name: "asc",
			},
		});

		const onlinePlayers = await this.prisma.players_online.findMany({
			where: {
				player_id: { in: characters.map((c) => c.id) },
			},
		});

		const onlinePlayerIds = new Set(onlinePlayers.map((p) => p.player_id));

		return characters.map((character) => ({
			...character,
			online: onlinePlayerIds.has(character.id),
		}));
	}

	async areOnline(playerIds: number[]) {
		const onlinePlayers = await this.prisma.players_online.findMany({
			where: {
				player_id: { in: playerIds },
			},
		});

		return onlinePlayers.map((p) => p.player_id);
	}

	async totalByAccountId(accountId: number) {
		return this.prisma.players.count({
			where: {
				account_id: accountId,
			},
		});
	}

	async byAccountId(
		accountId: number,
		opts?: { page?: number; size?: number },
	) {
		const page = opts?.page ?? 1;
		const size = opts?.size ?? 10;

		const [characters, total] = await Promise.all([
			this.prisma.players.findMany({
				where: {
					account_id: accountId,
				},
				orderBy: {
					name: "asc",
				},
				include: {
					player_depotitems: true,
					player_outfits: true,
					player_rewards: true,
					daily_reward_history: true,
					guilds: true,
					guild_membership: {
						include: {
							guild_ranks: true,
							guilds: true,
						},
					},
				},
				skip: (page - 1) * size,
				take: size,
			}),
			this.prisma.players.count({
				where: {
					account_id: accountId,
				},
			}),
		]);

		return { characters, total };
	}
}
