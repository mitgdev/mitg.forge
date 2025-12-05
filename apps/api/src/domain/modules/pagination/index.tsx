import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class Pagination {
	constructor(
		@inject(TOKENS.HttpContext) private readonly httpContext: HttpContext,
	) {}

	private baseUrl(): URL {
		return new URL(this.httpContext.req.url);
	}

	private makeLink(page: number, size: number): string {
		const url = this.baseUrl();
		url.searchParams.set("page", page.toString());
		url.searchParams.set("size", size.toString());
		return url.toString();
	}

	public paginate<T>(
		items: T[],
		opts: {
			page: number;
			size: number;
			total: number;
		},
	) {
		const totalPages = Math.ceil(opts.total / opts.size);

		return {
			meta: {
				page: opts.page,
				size: opts.size,
				total: opts.total,
				totalPages,
				hasNextPage: (opts.page - 1) * opts.size + items.length < opts.total,
				hasPreviousPage: opts.page > 1,
				links: {
					previous:
						opts.page > 1 ? this.makeLink(opts.page - 1, opts.size) : null,
					self: this.makeLink(opts.page, opts.size),
					next:
						(opts.page - 1) * opts.size + items.length < opts.total
							? this.makeLink(opts.page + 1, opts.size)
							: null,
				},
			},
			results: items,
		};
	}
}
