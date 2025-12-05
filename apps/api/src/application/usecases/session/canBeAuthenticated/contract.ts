import z from "zod";

export const SessionCanBeAuthenticatedContractSchema = {
	input: z.undefined(),
	output: z.void(),
};

export type SessionCanBeAuthenticatedContractInput = z.infer<
	typeof SessionCanBeAuthenticatedContractSchema.input
>;
export type SessionCanBeAuthenticatedContractOutput = z.infer<
	typeof SessionCanBeAuthenticatedContractSchema.output
>;
