import type { Prisma } from "generated/client";
import { inject, injectable } from "tsyringe";
import type { Prisma as Database } from "@/domain/clients";
import type { Cache, CacheKeys } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";

// biome-ignore lint/complexity/noBannedTypes: <only to type alias>
type ShopProduct = Prisma.miforge_shop_productGetPayload<{}>;

@injectable()
export class ShopProductRepository {
	constructor(
		@inject(TOKENS.Prisma) private readonly database: Database,
		@inject(TOKENS.Cache) private readonly cache: Cache,
		@inject(TOKENS.CacheKeys) private readonly cacheKeys: CacheKeys,
	) {}

	private invalidateCache(productId: string): Promise<void> {
		const { key } = this.cacheKeys.keys.shopProduct(productId);
		return this.cache.delete(key);
	}

	async findById(productId: string): Promise<ShopProduct | null> {
		const { key, ttl } = this.cacheKeys.keys.shopProduct(productId);

		const cached = await this.cache.get<ShopProduct>(key);

		if (cached) {
			return cached.data;
		}

		const product = await this.database.miforge_shop_product.findUnique({
			where: {
				id: productId,
			},
		});

		if (product) {
			await this.cache.save(key, product, ttl);
		}

		return product;
	}
}
