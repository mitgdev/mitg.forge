import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { Pagination } from "@/domain/modules";
import type { ShopProductRepository } from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import type { ShopProductFacet } from "@/shared/schemas/ShopProduct";
import type { PaginationInput } from "@/shared/utils/paginate";

@injectable()
export class ShopProductsService {
	constructor(
		@inject(TOKENS.ShopProductRepository)
		private readonly shopProductRepository: ShopProductRepository,
		@inject(TOKENS.Pagination) private readonly pagination: Pagination,
	) {}

	@Catch()
	async list(input: {
		pagination: Partial<PaginationInput>;
		filter?: {
			facets?: ShopProductFacet[];
		};
	}) {
		const page = input.pagination.page ?? 1;
		const size = input.pagination.size ?? 10;
		const facets = input.filter?.facets ?? [];

		const { products, total } = await this.shopProductRepository.findProducts({
			pagination: { page, size },
			filter: { facets },
		});

		return this.pagination.paginate(products, {
			page,
			size,
			total,
		});
	}
}
