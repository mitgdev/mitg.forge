import type z from "zod";
import { ListAccountSchema } from "@/shared/schemas/ListAccounts";
import { createPaginateSchema, InputPageSchema } from "@/shared/utils/paginate";

export const ListAccountsContractSchema = {
	input: InputPageSchema,
	output: createPaginateSchema(ListAccountSchema),
};

export type ListAccountsContractInput = z.infer<
	typeof ListAccountsContractSchema.input
>;

export type ListAccountsContractOutput = z.infer<
	typeof ListAccountsContractSchema.output
>;
