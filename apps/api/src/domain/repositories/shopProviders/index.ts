import type { ShopProvider, ShopProviderMethod } from "generated/client";
import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class ShopProvidersRepository {
	constructor(@inject(TOKENS.Prisma) private readonly database: Prisma) {}

	findById(id: number) {
		return this.database.miforge_shop_providers.findUnique({
			where: { id },
		});
	}

	findByMethodAndProvider(method: ShopProviderMethod, provider: ShopProvider) {
		return this.database.miforge_shop_providers.findUnique({
			where: {
				uniq_method_provider: {
					method,
					provider,
				},
			},
		});
	}

	findAll() {
		return this.database.miforge_shop_providers.findMany();
	}
}
