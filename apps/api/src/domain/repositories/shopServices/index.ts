import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class ShopServicesRepository {
	constructor(@inject(TOKENS.Prisma) private readonly database: Prisma) {}

	async listAll() {
		return this.database.miforge_shop_service.findMany();
	}

	async findById(id: number) {
		return this.database.miforge_shop_service.findUnique({
			where: {
				id,
			},
		});
	}

	async findBySlug(slug: string) {
		return this.database.miforge_shop_service.findUnique({
			where: {
				slug,
			},
		});
	}
}
