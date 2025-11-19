import type { player_items, players } from "generated/client";
import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";

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
