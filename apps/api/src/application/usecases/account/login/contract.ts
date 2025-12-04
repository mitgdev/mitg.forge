import { simplePasswordSchema } from "@miforge/core/schemas";
import z from "zod";

export const AccountLoginContractSchema = {
	input: z.object({
		email: z.email(),
		password: simplePasswordSchema,
		twoFactorCode: z.string().max(6).optional(),
	}),
	output: z.object({
		token: z.string(),
	}),
};

export type AccountLoginContractInput = z.infer<
	typeof AccountLoginContractSchema.input
>;
export type AccountLoginContractOutput = z.infer<
	typeof AccountLoginContractSchema.output
>;
