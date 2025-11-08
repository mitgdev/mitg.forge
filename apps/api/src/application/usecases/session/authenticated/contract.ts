import z from "zod";
import { AccountSchema } from "@/shared/schemas/Account";

export const SessionAuthenticatedContractSchema = {
	input: z.undefined(),
	output: AccountSchema,
};

export type SessionAuthenticatedContractInput = z.infer<
	typeof SessionAuthenticatedContractSchema.input
>;
export type SessionAuthenticatedContractOutput = z.input<
	typeof SessionAuthenticatedContractSchema.output
>;
