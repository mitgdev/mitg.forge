import z from "zod";

export const AccountLogoutContractSchema = {
	input: z.unknown(),
	output: z.void(),
};

export type AccountLogoutContractInput = z.infer<
	typeof AccountLogoutContractSchema.input
>;
export type AccountLogoutContractOutput = z.infer<
	typeof AccountLogoutContractSchema.output
>;
