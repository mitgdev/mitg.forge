import { ORPCError } from "@orpc/client";
import type { players } from "generated/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { Cache, CacheKeys, Logger } from "@/domain/modules";
import type {
	Outfit,
	OutfitAnimation,
	OutfitInput,
} from "@/domain/modules/outfit";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class PlayersService {
	constructor(
		@inject(TOKENS.Logger) private readonly logger: Logger,
		@inject(TOKENS.Outfit) private readonly outfit: Outfit,
		@inject(TOKENS.Cache) private readonly cache: Cache,
		@inject(TOKENS.CacheKeys) private readonly cacheKeys: CacheKeys,
	) {}

	@Catch()
	async getOutfitForPlayer(player: players): Promise<OutfitAnimation[]> {
		const outfitInput: OutfitInput = {
			looktype: player.looktype,
			addons: player.lookaddons,
			head: player.lookhead,
			body: player.lookbody,
			legs: player.looklegs,
			feet: player.lookfeet,
			mount: player.lookmountbody,
			direction: 3,
		};

		const outfit = await this.makeOutfit(outfitInput).catch(() => {
			this.logger.warn(
				`Failed to get outfit for player ${player.name} (looktype: ${player.looktype})`,
			);
			return null;
		});

		if (!outfit) {
			return [];
		}

		return outfit.frames;
	}

	@Catch()
	async makeOutfit(input: OutfitInput): Promise<{ frames: OutfitAnimation[] }> {
		const cacheKey = this.cacheKeys.keys.outfit(
			input.looktype,
			input.addons,
			input.head,
			input.body,
			input.legs,
			input.feet,
			input.mount ?? "nomount",
			input.direction ?? "nodir",
		);

		const cached = await this.cache.get<{ frames: OutfitAnimation[] }>(
			cacheKey.key,
		);

		if (cached) {
			return cached.data;
		}

		const animation = await this.outfit.getOutfit(input);

		if (!animation) {
			throw new ORPCError("NOT_FOUND", {
				message: "Outfit not found",
				data: { input },
			});
		}

		await this.cache.save(cacheKey.key, animation, cacheKey.ttl);

		return animation;
	}
}
