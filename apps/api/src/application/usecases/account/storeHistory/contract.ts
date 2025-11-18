import type z from "zod";
import { StoreHistory } from "@/shared/schemas/StoreHistory";
import { createPaginateSchema, InputPageSchema } from "@/shared/utils/paginate";

export const AccountStoreHistoryContractSchema = {
	input: InputPageSchema,
	output: createPaginateSchema(StoreHistory),
};

export type AccountStoreHistoryContractInput = z.infer<
	typeof AccountStoreHistoryContractSchema.input
>;
export type AccountStoreHistoryContractOutput = z.input<
	typeof AccountStoreHistoryContractSchema.output
>;
