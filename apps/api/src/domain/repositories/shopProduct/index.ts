import type { Prisma } from "generated/client";
import { inject, injectable } from "tsyringe";
import type { Prisma as Database } from "@/domain/clients";
import type { Cache, CacheKeys } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import type { ShopProductFacet } from "@/shared/schemas/ShopProduct";
import type { PaginationInput } from "@/shared/utils/paginate";
import { whereFromShopProductFacets } from "./whereFacets";

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

	async findProducts(input: {
		pagination: Partial<PaginationInput>;
		filter?: {
			facets?: ShopProductFacet[];
		};
	}) {
		const page = input.pagination.page ?? 1;
		const size = input.pagination.size ?? 10;
		const facets = input.filter?.facets ?? [];

		const whereFilter: Prisma.miforge_shop_productWhereInput = {
			...whereFromShopProductFacets(facets),
		};

		const [total, results] = await Promise.all([
			this.database.miforge_shop_product.count({
				where: whereFilter,
			}),
			this.database.miforge_shop_product.findMany({
				where: whereFilter,
				skip: (page - 1) * size,
				take: size,
			}),
		]);

		return {
			products: results,
			total,
		};
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
