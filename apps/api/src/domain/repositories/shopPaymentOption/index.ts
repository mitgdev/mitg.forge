import type { Prisma } from "generated/client";
import { inject, injectable } from "tsyringe";
import type { Prisma as Database } from "@/domain/clients";
import type { Cache, CacheKeys } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";

// biome-ignore lint/complexity/noBannedTypes: <only to type alias>
type ShopPaymentOption = Prisma.miforge_shop_payment_optionGetPayload<{}>;

@injectable()
export class ShopPaymentOptionRepository {
	constructor(
		@inject(TOKENS.Prisma) private readonly database: Database,
		@inject(TOKENS.Cache) private readonly cache: Cache,
		@inject(TOKENS.CacheKeys) private readonly cacheKeys: CacheKeys,
	) {}

	async findAll(): Promise<ShopPaymentOption[]> {
		const { key, ttl } = this.cacheKeys.keys.shopPaymentOptions();

		const cached = await this.cache.get<ShopPaymentOption[]>(key);

		if (cached) {
			return cached.data;
		}

		const paymentOptions =
			await this.database.miforge_shop_payment_option.findMany();

		await this.cache.save(key, paymentOptions, ttl);

		return paymentOptions;
	}

	async findById(id: string) {
		return this.database.miforge_shop_payment_option.findUnique({
			where: { id },
		});
	}
}
