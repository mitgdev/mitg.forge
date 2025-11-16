import z from "zod";

export const InputPageSchema = z.object({
	page: z.coerce.number().int().min(1).max(1000000).default(1),
	size: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationInput = z.infer<typeof InputPageSchema>;

export function createPaginateSchema<T extends z.ZodTypeAny>(itemSchema: T) {
	return z.object({
		meta: z.object({
			page: z.number().int().min(1),
			size: z.number().int().min(1),
			total: z.number().int().min(0),
			totalPages: z.number().int().min(0),
			hasNextPage: z.boolean(),
			hasPreviousPage: z.boolean(),
			links: z.object({
				previous: z.url().nullable(),
				self: z.url(),
				next: z.url().nullable(),
			}),
		}),
		results: z.array(itemSchema),
	});
}

export type Paginated<T> = {
	meta: {
		page: number;
		size: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		links: {
			previous: string | null;
			self: string;
			next: string | null;
		};
	};
	results: T[];
};
