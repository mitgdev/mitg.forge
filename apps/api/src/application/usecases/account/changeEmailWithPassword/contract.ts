import { simplePasswordSchema } from "@miforge/core/schemas";
import z from "zod";

export const AccountChangeEmailWithPasswordContractSchema = {
	input: z.object({
		password: simplePasswordSchema,
		newEmail: z.email(),
	}),
	output: z.void(),
};

export type AccountChangeEmailWithPasswordContractInput = z.infer<
	typeof AccountChangeEmailWithPasswordContractSchema.input
>;

export type AccountChangeEmailWithPasswordContractOutput = z.infer<
	typeof AccountChangeEmailWithPasswordContractSchema.output
>;
